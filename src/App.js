import React from 'react';
import serverInfo from './config/server.json'
import PatientsList from './components/patients-list'
import PatientInfo from './components/patient-info'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    changeID = (id) => {
        this.setState({ id })
    }

    render = () => {

        if (this.state.id) {
            return <PatientInfo endpoint={`http://${serverInfo.ip}:${serverInfo.port}/patient_info`} id={this.state.id}></PatientInfo>
        } else {
            return <PatientsList endpoint={`http://${serverInfo.ip}:${serverInfo.port}/patients_list`} onPatientSelected={this.changeID}></PatientsList>
        }
    }
}

export default App;