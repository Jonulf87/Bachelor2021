import React from 'react';

export default function MainPageNavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" href="#">
                                Nyheter
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Kjøp Billetter
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Logg inn
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}