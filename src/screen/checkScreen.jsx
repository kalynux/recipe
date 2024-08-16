import React, { Component } from "react";

class AppVersionToDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceType: "",
        };
        this.checkDeviceType = this.checkDeviceType.bind(this);
    }

    componentDidMount() {
        this.checkDeviceType();
        window.addEventListener("resize", this.checkDeviceType);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.checkDeviceType);
    }

    checkDeviceType() {
        if (window.matchMedia("(max-width: 767px)").matches) {
            this.setState({ deviceType: "mobile" });
        } else {
            this.setState({ deviceType: "desktop" });
        }
    }

    render() {
        const { deviceType } = this.state;
        return <>{this.props.renderComponent(deviceType)}</>;
    }
}

export default AppVersionToDisplay;
