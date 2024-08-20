using Application.Interfaces;
using Application.Photos;
using Azure;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName;

        public PhotoAccessor(IOptions<AzureBlobStorage> config)
        {
            _blobServiceClient = new BlobServiceClient(config.Value.ConnectionString);
            _containerName = config.Value.ContainerName;
        }

        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {
            if (file.Length > 0)
            {
                try
                {
                    var blobName = $"{file.FileName}-{Guid.NewGuid()}";
                    var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                    var blobClient = containerClient.GetBlobClient(blobName);
        
                    await blobClient.UploadAsync(file.OpenReadStream());
        
                    return new PhotoUploadResult
                    {
                        BlobName = blobName,
                        Url = blobClient.Uri.ToString()
                    };
                }
                catch (RequestFailedException ex)
                {
                    throw new Exception("Failed to upload image to Azure Blob Storage: " + ex.Message);
                }
            }
        
            return null;
        }

        public async Task<bool> DeletePhoto(string blobName)
        {
           
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            var blobClient = containerClient.GetBlobClient(blobName);
        
            var response = await blobClient.DeleteIfExistsAsync();
        
            return response.Value ? response.Value : false;
        }
    }
}