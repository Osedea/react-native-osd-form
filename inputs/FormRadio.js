import React from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    Picker,
    StyleSheet,
    View,
} from 'react-native';
import Input from '../Input';
import colors from '../colors';

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
});

export default class FormRadio extends Input {
    static type = 'radio';

    static propTypes = {
        buttonLabel: React.PropTypes.string, // Label to be displayed in the "button" for iOS
        options: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                value: React.PropTypes.string,
            })
        ),
        pickerStyle: Picker.propTypes.style,
        type: React.PropTypes.oneOf([this.type]),
        ...Input.propTypes,
    };

    createRadioCheckItemPressHandler = (option) => () => {
        if (option.onChange) {
            option.onChange(option.value);
        }

        this.handleChange(option.value);
        this.handleInputEnd();
    };

    render() {
        return super.render(
            <Picker
                selectedValue={typeof this.state.values[this.props.name] !== 'undefined' ? this.state.values[this.props.name] : this.props.selectedValue}
                onValueChange={this.handleChange}
                style={styles.picker || this.props.pickerStyle}
                ref={this.handleRef}
            >
                {this.props.options.map((item, optionIndex) => (
                    <Picker.Item
                        key={`${this.props.name}-option-${optionIndex}`}
                        label={item.label || item.value}
                        value={item.value}
                    />))}
            </Picker>
        );
    }
}
