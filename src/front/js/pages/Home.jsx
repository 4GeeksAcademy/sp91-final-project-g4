import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import transporte from "../../img/transporte.jpg";
import entrega from "../../img/entrega.jpg";
import mapa from "../../img/mapa.jpg";
// import trackingIcon from "../../img/trackingicon.webp";
// import deliveryIcon from "../../img/deliveryicon.webp";
// import coverageIcon from "../../img/coverageicon.webp";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div>
    <div id="myCarousel" className="carousel slide mb-6" data-bs-ride="carousel">
        <div className="carousel-indicators">
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-label="Slide 1">
                <img src={transporte} alt="Slide 1" style={{ width: '30px', height: '30px' }} />
            </button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2">
                <img src={mapa} alt="Slide 2" style={{ width: '30px', height: '30px' }} />
            </button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3">
                <img src={entrega} alt="Slide 3" style={{ width: '30px', height: '30px' }} />
            </button>
        </div>
        <div className="carousel-inner">
            <div className="carousel-item active">
                <img src={transporte} className="d-block w-100" alt="Slide 1" style={{ height: '400px', objectFit: 'cover' }} />
                <div className="container">
                    <div className="carousel-caption text-start">
                        <h1>Example headline.</h1>
                        <p className="opacity-75">Some representative placeholder content for the first slide of the carousel.</p>
                        <p><a className="btn btn-lg btn-primary" href="#">Sign up today</a></p>
                    </div>
                </div>
            </div>
            <div className="carousel-item">
                <img src={mapa} className="d-block w-100" alt="Slide 2" style={{ height: '400px', objectFit: 'cover' }} />
                <div className="container">
                    <div className="carousel-caption">
                        <h1>Another example headline.</h1>
                        <p>Some representative placeholder content for the second slide of the carousel.</p>
                        <p><a className="btn btn-lg btn-primary" href="#">Learn more</a></p>
                    </div>
                </div>
            </div>
            <div className="carousel-item">
                <img src={entrega} className="d-block w-100" alt="Slide 3" style={{ height: '400px', objectFit: 'cover' }} />
                <div className="container">
                    <div className="carousel-caption text-end">
                        <h1>One more for good measure.</h1>
                        <p>Some representative placeholder content for the third slide of this carousel.</p>
                        <p><a className="btn btn-lg btn-primary" href="#">Browse gallery</a></p>
                    </div>
                </div>
            </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
        </button>
    </div>

    <div className="container marketing">
        <div className="row">
            <div className="col-lg-4">
                <img src={transporte} className="bd-placeholder-img rounded-circle" width="140" height="140" alt="Transport" />
                <h2 className="fw-normal">Heading</h2>
                <p>Some representative content for the first column.</p>
                <p><a className="btn btn-secondary" href="#">View details »</a></p>
            </div>
            <div className="col-lg-4">
                <img src={mapa} className="bd-placeholder-img rounded-circle" width="140" height="140" alt="Map" />
                <h2 className="fw-normal">Heading</h2>
                <p>Another exciting bit of content. This is the second column.</p>
                <p><a className="btn btn-secondary" href="#">View details »</a></p>
            </div>
            <div className="col-lg-4">
                <img src={entrega} className="bd-placeholder-img rounded-circle" width="140" height="140" alt="Delivery" />
                <h2 className="fw-normal">Heading</h2>
                <p>The third column of representative content.</p>
                <p><a className="btn btn-secondary" href="#">View details »</a></p>
            </div>
        </div>

        <hr className="featurette-divider" />
				<hr class="featurette-divider" />
				<div class="row featurette">
					<div class="col-md-7">
						<h2 class="featurette-heading fw-normal lh-1">First featurette heading. <span class="text-body-secondary">It’ll blow your mind.</span></h2>
						<p class="lead">Some great placeholder content for the first featurette here. Imagine some exciting prose here.</p>
					</div>
					<div class="col-md-5">
						<svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="var(--bs-secondary-bg)"></rect><text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">500x500</text></svg>
					</div>
				</div>
				<hr class="featurette-divider" />
				<div class="row featurette">
					<div class="col-md-7 order-md-2">
						<h2 class="featurette-heading fw-normal lh-1">Oh yeah, it’s that good. <span class="text-body-secondary">See for yourself.</span></h2>
						<p class="lead">Another featurette? Of course. More placeholder content here to give you an idea of how this layout would work with some actual real-world content in place.</p>
					</div>
					<div class="col-md-5 order-md-1">
						<svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="var(--bs-secondary-bg)"></rect><text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">500x500</text></svg>
					</div>
				</div>
				<hr class="featurette-divider" />
				<div class="row featurette">
					<div class="col-md-7">
						<h2 class="featurette-heading fw-normal lh-1">And lastly, this one. <span class="text-body-secondary">Checkmate.</span></h2>
						<p class="lead">And yes, this is the last block of representative placeholder content. Again, not really intended to be actually read, simply here to give you a better view of what this would look like with some actual content. Your content.</p>
					</div>
					<div class="col-md-5">
						<svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="var(--bs-secondary-bg)"></rect><text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">500x500</text></svg>
					</div>
				</div>
				<hr class="featurette-divider" />
			</div>
		</div>


	)
};
