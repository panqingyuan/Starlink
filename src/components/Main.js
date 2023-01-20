import React, { Component } from 'react';
import{ Col, Row } from 'antd';
import axios from 'axios';

import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import WorldMap from './WorldMap';
import { SAT_API_KEY, BASE_URL, STARLINK_CATEGORY, NEARBY_SATELLITE } from '../constants';
import { setSelectionRange } from '@testing-library/user-event/dist/utils';

class Main extends Component {

    state = {
        setting: {},
        satList: [],
        satInfo: {},
        isLoadingList: false
    }

    showNearbySatellite = (setting) => {
        console.log('show nearby', setting)
        this.setState({
            setting: setting
        })
        this.fetchSatellite(setting);
    }

    fetchSatellite = setting => {
        //step1: get setting
        //step2: send the request to the server and display loading icon
        //step3: get the response from the server
        //  case1: success -> update satlist, unmount loading icon
        //  case2: fail ->inform users, unmount loading icon
        const { latitude, longitude, elevation, altitude } = setting;
        const url = `${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        this.setState({isLoadingList: true });

        axios.get(url)
            .then(res => {
                if(res.status === 200){
                    console.log(res.data);
                    this.setState({
                     satInfo: res.data,
                     isLoadingList: false
                    })
                }
            })
            .catch( error => {
                console.log('err in fetch satellite -> ', error);
            })
            .finally( () => {
                this.setState({ isLoadingList: false })
            })
    }

    showMap = (selected) => {
        console.log("selected sat list ->", selected);
        this.setState( preState => ({
            ...preState,
            satList: [...selected]
        }))
    }

    render () {

        const { satInfo, isLoadingList, satList, setting } = this.state;

        return (
            <Row className='main'>
                <Col span={8} className='left-side'>
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList satInfo = {satInfo}
                                    isLoad = {isLoadingList}
                                    onShowMap={this.showMap}
                    />
                </Col>
                <Col span={16} className='right0side'>
                    <WorldMap satData={satList} observerData={setting} />
                </Col>
            </Row>
        )
    }
}

export default Main;