import React from 'react';
import { Navbar } from 'src/components/navbar/navbar'
import { PatientInfo } from './content/timeline/timeline'
import PatientListPage from 'src/pages/patient-list/page'
import serverInfo from 'src/config/server.json'

export default class extends React.Component {
    render = () => {
        const nav = <Navbar
            buttons={[
                { title: 'Home', onClick: () => this.props.onChangeComponent({ dest: PatientListPage }) }
            ]} />

        const patient = <PatientInfo endpoint={`http://${serverInfo.ip}:${serverInfo.port}/patient_info`} id={this.props.id}></PatientInfo>
        return <>{nav}{patient}</>
    }
}