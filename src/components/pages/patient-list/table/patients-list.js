import React from 'react';
import MaterialTable from 'material-table';

class PatientsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            data: [],
            loading: true
        }
        this.download()
    }

    download = async () => {
        const bs = await fetch(this.props.endpoint)
        const data = await bs.json()
        const cols = []
        for(const field in data[0]) {
            cols.push({title: field, field: field, customFilterAndSearch: (term, row) => row.lastname.includes(term)})
        }
        this.setState({columns: cols, data: data, loading: false})
    }
    
    render = () => (
        <MaterialTable
        title="Patients"
        columns={this.state.columns}
        data={this.state.data}
        isLoading={this.state.loading}
        onRowClick={(ev, row) => this.props.onPatientSelected(row.id)}
        >
        </MaterialTable>
    )
}

export default PatientsList