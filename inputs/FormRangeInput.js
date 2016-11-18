import React from 'react';
import Slider from 'react-native-multi-slider';
import Input from '../Input';

export default class FormRangeInput extends Input {
    static type = 'range';

    static propTypes = {
        type: React.PropTypes.oneOf([this.type]),
        ...Slider.propTypes,
        ...Input.propTypes,
    };

    handleRangeChange = (value) => {
        this.handleChange(value);
        this.handleInputEnd();
    };

    render() {
        return super.render(
            <Slider
                {...this.props}
                onValuesChangeFinish={this.createInputChangeHandler(this.props)}
            />
        );
    }
}
