import React from 'react';
import { PatientsList } from './content/table/patients-list'
import PatientInfoPage from 'src/pages/patient-info/page'
import { PatientsListService } from 'src/services/patients-list'
import './style.css'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.asyncInit()
    }

    asyncInit = async () => {
        const { cols: columns, data } = await PatientsListService.download()
        this.setState({ columns, data })
    }

    changeID = (id) => {
        this.setState({ id })
        this.props.onChangeComponent({ dest: PatientInfoPage, data: { id } })
    }

    render = () => <div className="table-content">
        <PatientsList 
        columns={this.state.columns}
        data={this.state.data}
        onPatientSelected={this.changeID} />
    </div>
}