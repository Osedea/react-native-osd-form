import React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
} from 'react-native';
import colors from '../colors';
import Input from '../Input';

const styles = StyleSheet.create({
    input: {
        flex: 1,
        minHeight: 40,
        padding: 10,
        fontSize: 14,
        backgroundColor: colors.white,
        ...(Platform.OS === 'ios'
            ? {
                borderWidth: 1,
                borderRadius: 4, // Tried to fit with the apple doc https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/Controls.html#//apple_ref/doc/uid/TP40006556-CH15-SW1
            }
            : {}
        ),
        borderColor: colors.lighterGrey,
        justifyContent: 'center',
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
    inactivePasswordIcon: { tintColor: colors.inactiveTouchableUnderlayColor },
    textareaInput: {
        minHeight: 100,
    },
    error: {
        borderColor: colors.red,
    },
});

export default class FormTextInput extends Input {
    static acceptedTypes = [
        'email',
        'number',
        'password',
        'tel',
        'text',
        'textarea',
        'url',
        'word',
    ];

    static propTypes = {
        disabled: React.PropTypes.bool,
        inputContainerStyle: View.propTypes.style,
        isLastTextInput: React.PropTypes.bool,
        label: React.PropTypes.string,
        labelStyle: Text.propTypes.style,
        minHeight: React.PropTypes.number, // If multiline is true
        type: React.PropTypes.oneOf(this.acceptedTypes),
        ...TextInput.propTypes,
        ...Input.propTypes,
    };

    static defaultProps = {
        underlineColorAndroid: 'transparent',
        enablesReturnKeyAutomatically: true,
    };

    constructor(props) {
        super(props);

        this.state = {
            ...super.state,
            secureTextEntry: props.type === 'password',
            clearButtonMode: props.type === 'password' ? 'never' : 'while-editing',
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

    handleRef = (component) => {
        this.props.onRef(component, this.props.name);
    }

    handleSubmitEditing = () => {
        this.props.onSubmitEditing(this.props);
    }

    handleInputChange = (event) => {
        this.handleChange(event.nativeEvent.text);
    }

    render() {
        const TextInputComponent = this.props.component ? this.props.component : TextInput;
        let placeholderTextColor = this.props.globalStyles
            ? this.props.globalStyles.placeholderTextColor
            : colors.lightGrey
        ;

        if (this.props.placeholderTextColor) {
            placeholderTextColor = this.props.placeholderTextColor;
        }

        const input = (
            <TextInputComponent
                key={`${this.props.name}-input`}
                {...this.props}
                autoCapitalize={this.getAutoCapitalize()}
                autoCorrect={this.getAutoCorrect()}
                editable={!this.props.disabled}
                keyboardType={this.getKeyboardType()}
                multiline={this.props.type === 'textarea'}
                onSubmitEditing={this.props.type !== 'textarea'
                    ? this.onInputEnd
                    : null
                }
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
                onChange={this.handleInputChange}
                onBlur={this.handleInputEnd}
                placeholder={this.getPlaceholder()}
                placeholderTextColor={placeholderTextColor}
                ref={this.handleRef}
                returnKeyType={this.getReturnKeyType()}
                secureTextEntry={this.state.secureTextEntry}
                maxLength={this.getMaxLength()}
                clearButtonMode={this.state.clearButtonMode}
            />
        );

        let icon = null;

        if (typeof this.props.inputIcon === 'number') {
            // You passed a `require()`
            icon = (
                <TouchableHighlight
                    onPress={this.handleSecureTextEntryChange}
                    underlayColor={colors.touchableUnderlayColor}
                    style={[styles.inputTouchableIconStyle]}
                >
                    <Image
                        style={[
                            styles.inputIconStyle,
                            this.props.type === 'password' && (
                                this.state.secureTextEntry[this.props.name]
                                || typeof this.state.secureTextEntry[this.props.name] === 'undefined'
                            )
                                ? styles.inactivePasswordIcon
                                : {},
                        ]}
                        source={this.props.inputIcon}
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
                    color={this.props.activityIndicatorStyle}
                />
            );
        } else if (this.props.type === 'password' && !this.props.inputIcon) {
            // Default icon for password field
            icon = (
                <TouchableHighlight
                    onPress={this.handleSecureTextEntryChange}
                    underlayColor={colors.touchableUnderlayColor}
                    style={[styles.inputTouchableIconStyle]}
                >
                    <Image
                        style={[
                            styles.inputIconStyle,
                            !this.state.secureTextEntry
                                ? styles.inactivePasswordIcon
                                : {},
                        ]}
                        source={require('../images/show-password.png')}
                    />
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
            <View style={styles.iconAndInputContainer}>
                {input}
                {inputIcon}
            </View>
        );
    }
}
