import React, { useState, useEffect } from 'react';
import Form from '../Form/Form';

function Create () {
    const [currentId, setCurrentId] = useState(null);
    return (
        <Form currentId={currentId} setCurrentId={setCurrentId}/>
    );
}

export default Create;
