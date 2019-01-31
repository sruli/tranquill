import React from 'react';
import Navbar from './Navbar';
import { Input, Button } from '../../../components/elements';
import ArrowDownCircle from '../../../components/icons/ArrowDownCircle';
import styles from './Home.module.scss';

const Home = () => (
  <React.Fragment>
    <Navbar />

    <div className="container-fluid min-vh-100 pt-md-5">
      <div className="row">
        <div className="col-5 offset-1 pt-md-5">
          <div className="row mb-md-5">
            <div className="col">
              <h1 className={`display-1 ls-md-5 ${styles.display}`}>It&#39;s just a notebook—</h1>
            </div>
          </div>
          <div className="row mb-md-5">
            <div className="col">
              <h3 className="font-weight-normal">
                Thoughts. Ideas. Lyrics. Poetry. Whatever you want. Everything is encrypted so what you write is yours alone.
              </h3>
            </div>
          </div>
          <div className="row mb-md-5">
            <div className="col">
              <form>
                <div className="form-row align-items-end">
                  <div className="col">
                    <Input type="email" placeholder="Email address" />
                  </div>
                  <div className="col-auto">
                    <Button type="lg-primary">Get started</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="row mb-md-4">
            <div className="col">
              <h5 className="font-weight-normal">Can&#39;t hold that thought? Scroll down and get started.</h5>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center">
              <ArrowDownCircle />
            </div>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);

export default Home;
