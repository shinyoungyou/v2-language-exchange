import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import LoadingComponent from "@/components/layout/LoadingComponent";
import { useEffect, useMemo, useState } from "react";
import { router } from "@/routes/Routes";
import { toast } from "react-toastify";

export default observer(function LocationDashboard() {
    const { memberStore } = useStore();
    const { loadLocations, locations, loadingInitial } = memberStore;
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    });
    const [currentLocation, setCurrentLocation] = useState<{
        lat: number;
        lng: number;
    }>({ lat: 51.5074, lng: -0.1278 });

    useEffect(() => {
        loadLocations();
    }, [loadLocations]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    toast.error(error.message);
                }
            );
        } else {
            toast.error("Gelocation is not supported by your browser");
        }
    }, []);

    const current = useMemo(() => currentLocation, [currentLocation]);

    const handleMarkerClick = (username: string) => {
        router.navigate(`/members/${username}`);
    };

    if (!isLoaded || loadingInitial) {
        return <LoadingComponent />;
    }
    return (
        <>
            <GoogleMap
                zoom={6}
                center={current}
                mapContainerClassName="mapContainer"
            >
                {locations.length > 0 &&
                    locations.map((location) => (
                        <Marker
                            onClick={() => handleMarkerClick(location.username)}
                            key={location.username}
                            position={location.position}
                        />
                    ))}
            </GoogleMap>
        </>
    );
});
