import React from 'react';
import {
    Platform,
    StyleSheet,
    Switch,
    TouchableHighlight,
} from 'react-native';
import Button from 'react-native-osd-simple-button';

import Input from '../Input';
import colors from '../colors';

const styles = StyleSheet.create({
    onOffText: {
        padding: 10,
    },
});

export default class FormSwitch extends Input {
    static type = 'switch';

    static propTypes = {
        component: React.PropTypes.element,
        type: React.PropTypes.oneOf([this.type]),
        ...Button.propTypes,
        ...Input.propTypes,
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
                    onValueChange={this.handleSwitchChange}
                    value={typeof this.state.value !== 'undefined' ? this.state.value : this.props.value}
                />
            );
        } else {
            input = (
                <TouchableHighlight
                    underlayColor={colors.touchableUnderlayColor}
                    onPress={this.handleSwitchChange}
                    ref={this.handleRef}
                >
                    {this.state.value
                        ? <Text style={styles.onOffText}>{'True'}</Text>
                        : <Text style={styles.onOffText}>{'False'}</Text>
                    }
                </TouchableHighlight>
            );
        }

        return super.render(input);
    }
}
