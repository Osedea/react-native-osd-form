import React from 'react';
import {
    Dimensions,
    Picker,
    Platform,
    StyleSheet,
    View,
} from 'react-native';

import Input from '../Input';
import colors from '../colors';
import { formRadioType } from './types';

const styles = StyleSheet.create({
    radioContent: {
        position: 'absolute',
        left: 0,
        width: Dimensions.get('window').width,
    },
    IOSPickerButton: {
        borderWidth: 1,
        borderRadius: 4, // Tried to fit with the apple doc https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/Controls.html#//apple_ref/doc/uid/TP40006556-CH15-SW1
        borderColor: colors.lighterGrey,
    },
    radioCheckItemsContainer: {
        backgroundColor: colors.white,
        borderTopColor: colors.lighterGrey,
        borderTopWidth: 1,
    },
    radioCheckItemContainer: {
        flex: 1,
        borderBottomColor: colors.lighterGrey,
        borderBottomWidth: 1,
        padding: 20,
        flexDirection: 'row',
    },
    radioCheckItemLabel: {
        flex: 1,
        color: colors.lightGrey,
    },
    radioCheckCheckedIconContainer: { alignSelf: 'flex-end' },
    radioCheckCheckedIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        tintColor: colors.hnRed,
    },
    androidPicker: {
        backgroundColor: colors.white,
        borderColor: colors.lighterGrey,
        borderWidth: 1,
        alignSelf: 'center',
    },
});

export default class FormRadio extends Input {
    static type = formRadioType;

    static propTypes = {
        ...Picker.propTypes,
        buttonLabel: React.PropTypes.string, // Label to be displayed in the "button" for iOS
        itemStyle: Picker.propTypes.itemStyle,
        options: React.PropTypes.arrayOf(
            React.PropTypes.shape(Picker.Item.propTypes)
        ),
        pickerStyle: Picker.propTypes.style,
        type: React.PropTypes.oneOf([FormRadio.type]),
        ...Input.propTypes,
    };

    static defaultProps = {
        customize: {},
    };

    handleRadioChange = (value) => {
        this.handleChange(value);
        this.handleInputEnd();
    }

    render() {
        let picker = (
            <Picker
                selectedValue={
                    typeof this.state.value !== 'undefined'
                        ? this.state.value
                        : this.props.selectedValue
                }
                enabled={!this.props.disabled}
                onValueChange={this.handleRadioChange}
                itemStyle={[
                    this.props.customize.FormRadioPickerItemStyle,
                    this.props.itemStyle,
                ]}
                style={[
                    styles.picker,
                    this.props.customize.FormRadioPickerStyle,
                    this.props.pickerStyle,
                ]}
                ref={this.handleRef}
            >
                {this.props.options.map((item, optionIndex) => (
                    <Picker.Item
                        {...item}
                        key={`${this.props.name}-option-${optionIndex}`}
                        label={item.label || item.value}
                        style={[
                            this.props.customize.FormRadioPickerItemStyle,
                            this.props.itemStyle,
                            item.style,
                        ]}
                    />
                ))}
            </Picker>
        );

        if (Platform.OS === 'android') {
            picker = (
                <View
                    style={[
                        styles.picker,
                        this.props.customize.FormRadioPickerStyle,
                        this.props.pickerStyle,
                        styles.androidPicker,
                    ]}
                >
                    {picker}
                </View>
            )
        }

        return super.render(
            picker
        );
    }
}
