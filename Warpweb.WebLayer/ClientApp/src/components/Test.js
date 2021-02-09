import React, { useState } from 'react';
import NestedTested from './NestedTest';




export default function Test() {
    let [user, setUser] = useState("text");
    let altText = "Dette er en annen text";

    return (
        <div className="test">
            <p onClick={() => setUser(altText)}>{user}</p>
            <NestedTested user="blah" />
        </div>
    );
}


