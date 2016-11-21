import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { includes } from 'lodash';

import FormCheckbox from './FormCheckbox';
import Input from '../Input';

const styles = StyleSheet.create({
    container: {},
});

export default class FormCheckboxes extends Input {
    static type = 'checkboxes';

    static propTypes = {
        options: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                value: React.PropTypes.string,
                onChange: React.PropTypes.func,
                ...FormCheckbox.propTypes,
            })
        ),
        type: React.PropTypes.oneOf([FormCheckboxes.type]),
        ...Input.propTypes,
    };

    createCheckboxesChangeHandler = (option) => (checked) => {
        const selectedBoxes = this.state.value || [];

        if (checked && selectedBoxes.indexOf(option.value)) {
            selectedBoxes.push(option.value);
        } else {
            selectedBoxes.splice(selectedBoxes.indexOf(option.value), 1);
        }
        if (option.onChange) {
            option.onChange(checked);
        }

        this.handleChange(selectedBoxes);
        this.handleInputEnd();
    };

    render() {
        return super.render(
            <View
                style={this.props.containerStyle}
                ref={this.handleRef}
            >
                {this.props.options.map((item, optionIndex) => (
                    <FormCheckbox
                        {...item}
                        key={`${this.props.name}-option-${optionIndex}`}
                        labelContainerStyle={[
                            this.props.labelContainerStyle,
                            item.labelContainerStyle,
                        ]}
                        labelStyle={[
                            this.props.labelStyle,
                            item.labelStyle,
                        ]}
                        checked={typeof (item.checked) !== 'undefined'
                            ? item.checked
                            : includes(this.state.value, item.value)
                        }
                        onChange={this.createCheckboxesChangeHandler(item)}
                        style={[
                            this.props.style,
                            item.style,
                        ]}
                        checkboxStyle={[
                            this.props.checkboxStyle,
                            item.checkboxStyle,
                        ]}
                    />
                ))}
            </View>
        );
    }
}
