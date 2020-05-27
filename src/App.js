import React from 'react';
import PatientsList from './components/patients-list'

class App extends React.Component {
    render = () => ( 
        <PatientsList endpoint="http://localhost:2000/patients_list" onPatientSelected={(id) => alert(id)}></PatientsList>
    )
}

export default App;