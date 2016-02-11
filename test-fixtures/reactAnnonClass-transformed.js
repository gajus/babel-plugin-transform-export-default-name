import React from 'react';

let reactAnnonClass = class extends React.Component {
    render() {
        return <div>{this.props.children}</div>;
    }
};
export default reactAnnonClass;