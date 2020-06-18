import React from 'react';
import { PatientsList } from './content/table/patients-list'
import serverInfo from 'src/config/server.json'
import PatientInfoPage from 'src/pages/patient-info/page'
import './style.css'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    changeID = (id) => {
        this.setState({ id })
        this.props.onChangeComponent({ dest: PatientInfoPage, data: { id } })
    }

    render = () => <div className="table-content">
        <PatientsList
            endpoint={`http://${serverInfo.ip}:${serverInfo.port}/patients_list`}
            onPatientSelected={this.changeID} />
    </div>
}