import React from 'react';
import PatientListPage from 'src/pages/patient-list/page'
import PatientInfoPage from 'src/pages/patient-info/page'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = { actualPage: PatientListPage, pageData: null }
    }

    changeComponent = ({ dest, data }) => {
        this.setState({ actualPage: dest, pageData: data })
    }

    render = () => {
        switch (this.state.actualPage) {
            case PatientListPage:
                return <PatientListPage
                    onChangeComponent={this.changeComponent}
                    {...this.state.pageData}
                />

            case PatientInfoPage:
                return <PatientInfoPage
                    onChangeComponent={this.changeComponent}
                    {...this.state.pageData}
                />

            default:
                return <></>
        }
    }
}

export default App;