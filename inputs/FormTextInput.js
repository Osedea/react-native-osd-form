import React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    View,
} from 'react-native';
import colors from '../colors';
import Input from '../Input';
import { formTextInputAcceptedTypes } from './types';

const styles = StyleSheet.create({
    input: {
        flex: 1,
        minHeight: 40,
        fontSize: 14,
        backgroundColor: colors.white,
        ...(Platform.OS === 'ios'
            ? {
                borderWidth: 1,
                borderRadius: 4, // Tried to fit with the apple doc https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/Controls.html#//apple_ref/doc/uid/TP40006556-CH15-SW1
                padding: 10,
            }
            : {
                paddingLeft: 5,
                paddingRight: 5,
                borderRadius: 4,
                borderWidth: 1,
                paddingTop: 0,
                paddingBottom: 0,
            }
        ),
        borderColor: colors.lighterGrey,
        justifyContent: 'center',
        textAlignVertical: 'center',
    },
    iconAndInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeSecureTextContainerStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        minHeight: 40,
        marginLeft: -30,
    },
    changeSecureTextContainerErrorStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        minHeight: 40,
        marginLeft: -30,
    },
    inputIconStyle: {
        tintColor: colors.touchableUnderlayColor,
        width: 20,
        height: 13,
        marginRight: 10,
    },
    inputIconContainer: {
        height: 40,
        maxWidth: 40,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    inactivePasswordIcon: { tintColor: colors.inactiveTouchableUnderlayColor },
    textareaInput: {
        minHeight: 100,
    },
    error: {
        borderColor: colors.red,
    },
});

export default class FormTextInput extends Input {
    static acceptedTypes = formTextInputAcceptedTypes;

    static propTypes = {
        disabled: React.PropTypes.bool,
        inputContainerStyle: View.propTypes.style,
        isLastTextInput: React.PropTypes.bool,
        minHeight: React.PropTypes.number, // If multiline is true
        type: React.PropTypes.oneOf(FormTextInput.acceptedTypes),
        ...TextInput.propTypes,
        ...Input.propTypes,
    };

    static defaultProps = {
        enablesReturnKeyAutomatically: true,
        underlineColorAndroid: 'transparent',
        customize: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            ...super.state,
            clearButtonMode: props.type === 'password' ? 'never' : 'while-editing',
            secureTextEntry: props.type === 'password',
        };
    }

    getAutoCapitalize = () => {
        if (this.props.autoCapitalize) {
            return this.props.autoCapitalize;
        }

        switch (this.props.type) {
            case 'email':
            case 'url':
            case 'password':
                return 'none';
            default:
                return 'sentences';
        }
    }

    getAutoCorrect = () => {
        if (this.props.autoCorrect) {
            return this.props.autoCorrect;
        }

        switch (this.props.type) {
            case 'email':
            case 'url':
            case 'password':
                return false;
            default:
                return true;
        }
    }

    getKeyboardType = () => {
        if (this.props.keyboardType) {
            return this.props.keyboardType;
        }

        switch (this.props.type) {
            case 'email':
                return 'email-address';
            case 'number':
                return 'number-pad';
            case 'tel':
                return 'phone-pad';
            case 'url':
                return 'url';
            default:
                return 'default';
        }
    };

    getMaxLength = () => {
        if (this.props.maxLength) {
            return this.props.maxLength;
        }

        switch (this.props.type) {
            // case 'color':
            case 'email':
                return 255;
            case 'tel':
                return 15; // https://en.wikipedia.org/wiki/Telephone_numbering_plan
            case 'number':
            case 'password':
            case 'text':
            case 'url':
            case 'word':
            default:
                return null;
        }
    };

    getPlaceholder = () => {
        if (this.props.placeholder) {
            return this.props.placeholder;
        }

        switch (this.props.type) {
            case 'email':
                return 'ie: test@domain.com';
            case 'tel':
                return 'ie: +1 234 567 8910';
            case 'number':
                return 'ie: 42';
            case 'password':
                return 'ie: MySecretP@ssw0rd!';
            case 'text':
                return 'ie: Enter some text here.';
            case 'url':
                return 'ie: http://www.example.com/';
            case 'word':
                return 'ie: One-Word';
            default:
                return null;
        }
    }

    getReturnKeyType = () => {
        if (this.props.returnKeyType) {
            return this.props.returnKeyType;
        }

        if (this.props.type === 'textarea') {
            return 'default';
        } else if (this.props.isLastTextInput) {
            return 'go';
        } else {
            return 'next';
        }
    };

    handleSecureTextEntryChange = () => {
        this.setState({ secureTextEntry: !this.state.secureTextEntry });
    }

    handleSubmitEditing = () => {
        this.handleInputEnd();
    }

    handleFocus = () => {
        this.props.onFocus(this.props);
    }

    handleBlur = () => {
        this.handleValidation();
    }

    handleInputChange = (event) => {
        this.handleChange(event.nativeEvent.text);
    }

    render() {
        const TextInputComponent = this.props.component ? this.props.component : TextInput;
        let placeholderTextColor = this.props.customize.FormTextInputPlaceholderTextColor || colors.lightGrey;

        if (this.props.placeholderTextColor) {
            placeholderTextColor = this.props.placeholderTextColor;
        }

        const input = (
            <TextInputComponent
                {...this.props}
                autoCapitalize={this.getAutoCapitalize()}
                autoCorrect={this.getAutoCorrect()}
                clearButtonMode={this.state.clearButtonMode}
                editable={!this.props.disabled}
                key={`${this.props.name}-input`}
                keyboardType={this.getKeyboardType()}
                maxLength={this.getMaxLength()}
                multiline={this.props.type === 'textarea'}
                onBlur={this.handleBlur}
                onChange={this.handleInputChange}
                onFocus={this.handleFocus}
                onSubmitEditing={this.props.type !== 'textarea'
                    ? this.handleSubmitEditing
                    : null
                }
                placeholder={this.getPlaceholder()}
                placeholderTextColor={placeholderTextColor}
                ref={this.handleRef}
                returnKeyType={this.getReturnKeyType()}
                secureTextEntry={this.state.secureTextEntry}
                style={[
                    styles.input,
                    this.props.type === 'textarea'
                        ? styles.textareaInput
                        : null,
                    this.state.error
                        ? styles.error
                        : null,
                    this.props.style,
                    this.state.error && this.props.errorStyle
                        ? this.props.errorStyle
                        : null,
                ]}
            />
        );

        let icon = null;

        if (typeof this.props.inputIcon === 'number') {
            // You passed a `require()`
            icon = (
                <TouchableHighlight
                    onPress={this.handleSecureTextEntryChange}
                    style={[styles.inputTouchableIconStyle]}
                    underlayColor={'transparent'}
                >
                    <Image
                        source={this.props.inputIcon}
                        style={[
                            styles.inputIconStyle,
                            this.props.type === 'password' && (
                                this.state.secureTextEntry[this.props.name]
                                || typeof this.state.secureTextEntry[this.props.name] === 'undefined'
                            )
                                ? styles.inactivePasswordIcon
                                : {},
                        ]}
                    />
                </TouchableHighlight>
            );
        } else if (typeof this.props.inputIcon === 'function') {
            // You passed a `renderIcon` function returning and React Component
            const Icon = this.props.inputIcon;

            icon = (
                <Icon
                    style={[
                        styles.inputIconStyle,
                        !this.props.type === 'password' && this.state.secureTextEntry
                            ? styles.inactivePasswordIcon
                            : {},
                    ]}
                />
            );
        } else if (this.props.type === 'password' && !this.props.inputIcon) {
            // Default icon for password field
            icon = (
                <TouchableHighlight
                    onPress={this.handleSecureTextEntryChange}
                    style={styles.inputTouchableIconStyle}
                    underlayColor={'transparent'}
                >
                    <View style={styles.inputIconContainer}>
                        <Image
                            source={require('../images/show-password.png')}
                            style={[
                                styles.inputIconStyle,
                                !this.state.secureTextEntry
                                    ? styles.inactivePasswordIcon
                                    : {},
                            ]}
                        />
                    </View>
                </TouchableHighlight>
            );
        }

        const inputIcon = icon
            ? <View
                style={this.state.error
                    ? styles.changeSecureTextContainerErrorStyle
                    : styles.changeSecureTextContainerStyle
                }
            >
                {icon}
            </View>
            : null;

        return super.render(
            <View
                style={[
                    styles.iconAndInputContainer,
                    this.props.inputContainerStyle,
                ]}
            >
                {input}
                {inputIcon}
            </View>
        );
    }
}
