import React from 'react';
import './style.css'

export class Navbar extends React.Component {
    render = () => {
        const buttons = []
        for (const { title, onClick } of this.props.buttons) {
            buttons.push(<button className='btn btn-primary' onClick={onClick}>{title}</button>)
        }

        return <div id="nav">{buttons}</div>
    }
}