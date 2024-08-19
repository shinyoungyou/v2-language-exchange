import React, { useState } from 'react';
import {Button, Header, Segment} from "semantic-ui-react";
import axios from 'axios';
import ValidationError from './ValidationError';

export default function TestErrors() {
    const baseUrl = import.meta.env.VITE_API_URL
    const [errors, setErrors] = useState(null);

    function handleNotFound() {
        axios.get(baseUrl+'/buggy/not-found').catch(err => console.log(err.response));
    }

    function handleBadRequest() {
        axios.get(baseUrl+'/buggy/bad-request').catch(err => console.log(err));
    }

    function handleValidationError() {
        axios.put(baseUrl+'/members', {}).catch(err => {
            console.log(err);
            setErrors(err);
        });
    }

    function handleServerError() {
        axios.get(baseUrl+'/buggy/server-error').catch(err => console.log(err.response));
    }

    function handleUnauthorised() {
        axios.get(baseUrl+'/buggy/unauthorised').catch(err => console.log(err.response));
    }

    function handleBadUsername() {
        axios.get(baseUrl+'/members/ghostuser').catch(err => console.log(err.response));
    }


    return (
        <>
            <Header as='h1' content='Test Error component' />
            <Segment>
                <Button.Group widths='6'>
                    <Button onClick={handleNotFound} content='Not Found' basic primary />
                    <Button onClick={handleBadRequest} content='Bad Request' basic primary />
                    <Button onClick={handleValidationError} content='Validation Error' basic primary />
                    <Button onClick={handleServerError} content='Server Error' basic primary />
                    <Button onClick={handleUnauthorised} content='Unauthorised' basic primary />
                    <Button onClick={handleBadUsername} content='Bad Username' basic primary />
                </Button.Group>
            </Segment>
            {errors && <ValidationError errors={errors} />}
        </>
    )
}