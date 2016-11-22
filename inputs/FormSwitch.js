import React from 'react';
import {
    Platform,
    StyleSheet,
    Switch,
    TouchableHighlight,
} from 'react-native';

import Input from '../Input';
import colors from '../colors';
import { formSwitchType } from './types';

const styles = StyleSheet.create({
    onOffText: {
        padding: 10,
    },
});

export default class FormSwitch extends Input {
    static type = formSwitchType;

    static propTypes = {
        component: React.PropTypes.element,
        type: React.PropTypes.oneOf([FormSwitch.type]),
        ...Switch.propTypes,
        ...Input.propTypes,
    };

    static defaultProps = {
        customize: {},
    };

    handleSwitchChange = (value) => {
        this.handleChange(typeof value === 'undefined' ? !this.state.value : value);
        this.handleInputEnd();
    }

    render() {
        let input;

        if (Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version >= 21)) {
            input = (
                <Switch
                    {...this.props}
                    onTintColor={this.props.onTintColor || this.props.customize.FormSwitchOnTintColor}
                    tintColor={this.props.tintColor || this.props.customize.FormSwitchTintColor}
                    thumbTintColor={this.props.thumbTintColor || this.props.customize.FormSwitchThumbTintColor}
                    onValueChange={this.handleSwitchChange}
                    value={typeof this.state.value !== 'undefined' ? this.state.value : this.props.value}
                />
            );
        } else {
            input = (
                <TouchableHighlight
                    {...this.props}
                    underlayColor={colors.touchableUnderlayColor}
                    onPress={this.handleSwitchChange}
                    style={{ backgroundColor: this.props.thumbTintColor || this.props.customize.FormSwitchThumbTintColor }}
                    ref={this.handleRef}
                >
                    {this.state.value
                        ? <Text
                            style={[
                                styles.onOffText,
                                { color: this.props.onTintColor || this.props.customize.FormSwitchOnTintColor },
                            ]}
                        >
                            {'True'}
                        </Text>
                        : <Text
                            style={[
                                styles.onOffText,
                                { color: this.props.tintColor || this.props.customize.FormSwitchTintColor },
                            ]}
                        >
                            {'False'}
                        </Text>
                    }
                </TouchableHighlight>
            );
        }

        return super.render(input);
    }
}
