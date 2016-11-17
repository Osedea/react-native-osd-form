import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    ImageEditor,
    ImageStore,
    NativeModules,
    Picker,
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Switch,
} from 'react-native';
import { find, includes, findIndex, forEach, reduce, findLastIndex } from 'lodash';
import MultipleImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import Checkbox from 'react-native-checkbox';
import Slider from 'react-native-multi-slider';
import DateTimePicker from 'react-native-osd-datetimepicker';

import { translate } from 'HeyNeighburz/app/localization/localization';
import Button from 'HeyNeighburz/app/components/overrides/Button';
import Modal from 'HeyNeighburz/app/components/Modal';
import TextInput from 'HeyNeighburz/app/components/overrides/TextInput';
import colors from 'HeyNeighburz/app/config/colors';

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        backgroundColor: colors.transparent,
        color: colors.white,
        marginBottom: 2,
    },
    inputContainer: {
        marginTop: Platform.OS === 'ios'
            ? 10
            : 0,
    },
    separator: {
        backgroundColor: '#333333',
        height: 1,
        marginTop: 5,
        marginBottom: 5,
    },
    previewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    previewImageContainer: {
        flex: 1,
    },
    previewImage: {
        width: 40,
        height: 40,
    },
    removeText: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonRemove: {
        backgroundColor: '#CCCCCC',
        borderWidth: 0,
    },
    radioContent: {
        position: 'absolute',
        left: 0,
        width: Dimensions.get('window').width,
    },
    IOSPickerButton: {
        borderWidth: 1,
        borderRadius: 4, // Tried to fit with the apple doc https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/Controls.html#//apple_ref/doc/uid/TP40006556-CH15-SW1
        borderColor: '#DDDDDD',
    },
    IOSPickerButtonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imageButtonContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    imageButtonIconStyle: {
        width: 25,
        height: 25,
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    checkboxContainerStyle: { alignItems: 'flex-start' },
    checkboxLabelContainer: {
        flex: 1,
    },
    checkboxBoxStyle: {
        width: 17,
        height: 17,
        margin: 1,
    },
    pillsContainerStyle: {
        marginTop: -10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    pillContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderBottomWidth: 4,
        borderBottomColor: colors.white,
    },
    pillTextStyle: {
        color: colors.darkGrey,
    },
    imageUploadContainer: {
        flex: 1,
        backgroundColor: colors.white,
        height: 110,
        marginTop: -10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    imageUploadStyle: {
        height: 40,
        width: 40,
    },
    imageEditStyle: {
        height: 30,
        width: 30,
        marginLeft: 5,
        marginRight: 5,
    },
    textUploadStyle: {
        fontSize: 10,
        color: colors.lightGrey,
        marginTop: 5,
    },
    imageUploadPreview: {
        resizeMode: 'cover',
        width: Dimensions.get('window').width - 40,
        height: 110,
        borderColor: colors.white,
        borderWidth: 2,
    },
    previewImageOverlay: {
        position: 'absolute',
        top: 2,
        left: 2,
        right: 0,
        bottom: 0,
        width: Dimensions.get('window').width - 44,
        height: 110 - 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    previewImageOverlayContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeSecureTextContainerStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: -3,
        marginLeft: -30,
    },
    changeSecureTextContainerErrorStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: -15,
        marginLeft: -30,
    },
    inputIconStyle: {
        tintColor: colors.white,
        width: 20,
        height: 13,
        marginRight: 10,
    },
    inactivePasswordIcon: { tintColor: colors.hnBlue },
    textareaInput: {
        flex: 1,
        minHeight: 100,
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
    onOffText: {
        padding: 10,
    },
    error: {
        paddingLeft: 10,
        color: colors.hnRedError,
        fontSize: 10,
        backgroundColor: colors.transparent,
        marginTop: 2,
    },
});

const textLikeTypes = [
    'email',
    'number',
    'password',
    'tel',
    'text',
    'textarea',
    'url',
    'word',
];

const buttonLikeTypes = [
    'button',
    'submit',
];

const temporalTypes = [
    'date',
    'datetime',
    'time',
];

// Types that we can do something on when hitting NEXT on the previous field
const interactableTypes = [
    ...textLikeTypes,       // Focus
    ...buttonLikeTypes,     // Execute the onPress method
    'image',                // Open the picker
    'file',                 // Open the picker
];

const IMAGE_OPTIONS = {
    title: translate('form.imagePicker.imagePickerTitle') || 'Pick your image',
    cancelButtonTitle: translate('form.imagePicker.imagePickerCancelButtonTitle') || 'Cancel',
    takePhotoButtonTitle: translate('form.imagePicker.imagePickerTakePhotoButtonTitle') || 'Take picture',
    chooseFromLibraryButtonTitle: translate('form.imagePicker.imagePickerChooseFromLibraryButtonTitle') || 'Pick from Library',
    mediaType: 'photo',
    aspectX: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.8, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: true, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
    storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images', // ios only - will save image at /Documents/images rather than the root
    },
    maxWidth: 800,
    cameraType: 'back',
};

const VIDEO_OPTIONS = {
    title: translate('form.imagePicker.videoPickerTitle') || 'Pick your video',
    cancelButtonTitle: translate('form.imagePicker.videoPickerCancelButtonTitle') || 'Cancel',
    takePhotoButtonTitle: translate('form.imagePicker.videoPickerTakePhotoButtonTitle') || 'Take picture',
    chooseFromLibraryButtonTitle: translate('form.imagePicker.videoPickerChooseFromLibraryButtonTitle') || 'Pick from Library',
    mediaType: 'video',
    videoQuality: 'low', // 'low' or 'high' ('medium' is available for iOs but let's stick to cross-platform values)
    storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'videos', // ios only - will save image at /Documents/images rather than the root
    },
    maxWidth: 800,
    cameraType: 'back',
};

const defaultCheckedIcon = require('HeyNeighburz/app/images/icon_confirmation.png');

const inputPropType = (props, propName, componentName, ...rest) => {
    props.forEach((propsToTest) => {
        if (textLikeTypes.indexOf(propsToTest.type) >= 0) {
            // Text-like inputs using https://facebook.github.io/react-native/docs/textinput.html
            return React.PropTypes.shape({
                disabled: React.PropTypes.bool,
                label: React.PropTypes.string,
                labelStyle: Text.propTypes.style,
                minHeight: React.PropTypes.number, // If multiline is true
                name: React.PropTypes.string.isRequired,
                onChange: React.PropTypes.func,
                type: React.PropTypes.oneOf(textLikeTypes),
                validationFunctions: React.PropTypes.arrayOf(React.PropTypes.func),
                validationErrorMessages: React.PropTypes.arrayOf(React.PropTypes.string),
                inputContainerStyle: View.propTypes.style,
                ...TextInput.propTypes,
            })(props, propName, componentName, ...rest);
        } else if (buttonLikeTypes.indexOf(propsToTest.type) >= 0) {
            // Button-like inputs using https://github.com/Osedea/react-native-osd-simple-button
            return React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                type: React.PropTypes.oneOf(buttonLikeTypes),
                component: React.PropTypes.element,
                inputContainerStyle: View.propTypes.style,
                ...Button.propTypes,
            })(props, propName, componentName, ...rest);
        } else if (temporalTypes.indexOf(propsToTest.type) >= 0) {
            // Temporal inputs using https://github.com/Osedea/react-native-osd-datetimepicker
            return React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                label: React.PropTypes.string,
                labelStyle: Text.propTypes.style,
                inputLabel: React.PropTypes.string,
                onChange: React.PropTypes.func,
                type: React.PropTypes.oneOf(temporalTypes),
                inputContainerStyle: View.propTypes.style,
                ...DateTimePicker.propTypes,
            })(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'checkboxes') {
            // Wrapping several react-native-checkbox as one input component
            // using https://github.com/sconxu/react-native-checkbox
            return React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                onChange: React.PropTypes.func,
                type: React.PropTypes.oneOf(['checkboxes']),
                containerStyle: View.propTypes.style,
                inputContainerStyle: View.propTypes.style,
                options: React.PropTypes.arrayOf(
                    React.PropTypes.shape({
                        label: React.PropTypes.string,
                        value: React.PropTypes.string,
                        onChange: React.PropTypes.func,
                        ...Checkbox.propTypes,
                    })
                ),
            })(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'checkbox') {
            // Simple checkbox using https://github.com/sconxu/react-native-checkbox
            return React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                onChange: React.PropTypes.func,
                type: React.PropTypes.oneOf(['checkbox']),
                checkboxLabel: React.PropTypes.string,
                inputContainerStyle: View.propTypes.style,
                ...Checkbox.propTypes,
            })(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'radio') {
            // Using RN Picker https://facebook.github.io/react-native/docs/picker.html
            return React.PropTypes.shape({
                buttonLabel: React.PropTypes.string, // Label to be displayed in the "button" for iOS
                name: React.PropTypes.string.isRequired,
                onChange: React.PropTypes.func,
                type: React.PropTypes.oneOf(['radio']),
                pickerStyle: Picker.propTypes.style,
                inputContainerStyle: View.propTypes.style,
                options: React.PropTypes.arrayOf(
                    React.PropTypes.shape({
                        label: React.PropTypes.string,
                        value: React.PropTypes.string,
                    })
                ),
            })(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'radio-check') {
            // Using RN Picker https://facebook.github.io/react-native/docs/picker.html
            return React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                onChange: React.PropTypes.func,
                type: React.PropTypes.oneOf(['radio-check']),
                inputContainerStyle: View.propTypes.style,
                options: React.PropTypes.arrayOf(
                    React.PropTypes.shape({
                        label: React.PropTypes.string,
                        value: React.PropTypes.string,
                    })
                ),
                checkedIcon: React.PropTypes.number,
            })(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'pills') {
            return React.PropTypes.shape({
                type: React.PropTypes.oneOf(['pills']),
                style: View.propTypes.style,
                options: React.PropTypes.arrayOf(
                    React.PropTypes.shape({
                        label: React.PropTypes.string,
                        value: React.PropTypes.string,
                    })
                ),
            })(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'range') {
            // Slider using https://github.com/JackDanielsAndCode/react-native-multi-slider
            return React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                onChange: React.PropTypes.func,
                type: React.PropTypes.oneOf(['range']),
                inputContainerStyle: View.propTypes.style,
                ...Slider.propTypes,
            })(props, propName, componentName, ...rest);
        } else if (['image', 'video'].indexOf(propsToTest.type) >= 0) {
            // Image picker using https://github.com/marcshilling/react-native-image-picker
            return React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                pickerOptions: React.PropTypes.object, // For more info, see https://github.com/marcshilling/react-native-image-picker#options
                onChangeFailed: React.PropTypes.func,
                onCancel: React.PropTypes.func,
                onChange: React.PropTypes.func.isRequired,
                type: React.PropTypes.oneOf(['image', 'video']),
                inputContainerStyle: View.propTypes.style,
            })(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'hidden') {
            // Hidden field
            return React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                type: React.PropTypes.oneOf(['hidden']),
                inputContainerStyle: View.propTypes.style,
                value: React.PropTypes.oneOfType([
                    React.PropTypes.string,
                    React.PropTypes.number,
                ]).isRequired,
            })(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'separator') {
            // Separator
            return React.PropTypes.shape({
                label: React.PropTypes.string,
                labelStyle: Text.propTypes.style,
                type: React.PropTypes.oneOf(['separator']),
                inputContainerStyle: View.propTypes.style,
                style: View.propTypes.style,
            })(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'switch') {
            return React.PropTypes.shape({
                labelStyle: Text.propTypes.style,
                value: React.PropTypes.oneOfType([
                    React.PropTypes.string,
                    React.PropTypes.number,
                ]),
                style: View.propTypes.style,
                onChange: React.PropTypes.func,
            })(props, propName, componentName, ...rest);
        } else {
            return new Error(`Type '${propsToTest.type}' of input is not recognized.`);
        }
    });
};

export default class Form extends Component {
    static propTypes = {
        containerStyle: View.propTypes.style,
        formGroups: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                inputs: React.PropTypes.arrayOf(inputPropType).isRequired,
                insertBefore: React.PropTypes.node,
                insertAfter: React.PropTypes.node,
                style: View.propTypes.style,
            })
        ).isRequired,
        inputContainerStyle: View.propTypes.style,
        labelStyle: Text.propTypes.style,
        placeholderTextColor: TextInput.propTypes.placeholderTextColor,
        onChange: React.PropTypes.func,
        // `onChange` will be called at any change in the Form.
        // It will not provide any value, just call the function
        onSubmit: React.PropTypes.func,
        triggerSubmitFunctionRef: React.PropTypes.func,
    };

    static defaultProps = {
        underlineColorAndroid: 'transparent',
        enablesReturnKeyAutomatically: true,
        clearButtonMode: 'while-editing',
    };

    constructor(props) {
        super(props);

        this.formRefs = {};
        if (this.props.triggerSubmitFunctionRef && typeof this.props.triggerSubmitFunctionRef === 'function') {
            this.props.triggerSubmitFunctionRef(this.handleSubmit);
        }

        this.inputs = props.formGroups.reduce((results, formGroup) => {
            formGroup.inputs.forEach((input) => {
                results.push(input);
            });

            return results;
        }, []);

        // To know if we need to put the autoFocus on the first field
        // or if the user defined it on one of the fields
        this.isAutoFocusDefined = findIndex(this.inputs, (input) => input.autoFocus) !== -1;

        this.state = {
            isValid: false,
            formErrors: {},
            values: this.getInitialValues(this.inputs),
            secureTextEntry: {},
        };
    }

    componentWillReceiveProps = (nextProps) => {
        const newStateValue = {};

        this.inputs = nextProps.formGroups.reduce((results, formGroup) => {
            formGroup.inputs.forEach((input) => {
                if (input.type === 'checkbox' && input.checked) {
                    newStateValue[input.name] = true;
                } else if (input.type === 'checkboxes') {
                    input.options.forEach((option) => {
                        if (option.checked) {
                            if (!newStateValue[input.name]) {
                                newStateValue[input.name] = [];
                            }
                            newStateValue[input.name].push(option.value);
                        }
                    });
                } else if (includes(textLikeTypes, input.type) || input.type === 'image') {
                    const inputFound = this.inputs.find((foundInput) => input.name === foundInput.name);

                    if (inputFound && input.value !== inputFound.value) {
                        newStateValue[input.name] = input.value;
                    }
                } else if (input.type === 'hidden') {
                    newStateValue[input.name] = input.value;
                }

                results.push(input);
            });

            return results;
        }, []);

        setTimeout(() => {
            this.setState({
                values: {
                    ...this.state.values,
                    ...newStateValue,
                },
            });
        }, 300);
    }

    getInitialValues = () => {
        /* eslint-disable no-param-reassign */
        const initialValues = this.inputs.reduce(
            (result, input) => {
                if (input.type === 'hidden') {
                    result[input.name] = input.value;
                } else if (input.type === 'pills') {
                    result[input.name] = input.initialValue;
                } else if (input.type === 'radio-check') {
                    result[input.name] = input.value;
                } else if (input.type === 'checkboxes') {
                    result[input.name] = reduce(
                        input.options,
                        (subResult, option) => {
                            if (option.defaultChecked) {
                                subResult.push(option.value);
                            }

                            return subResult;
                        },
                        [] // Initial 'subResult' object
                    );
                } else if (includes(textLikeTypes, input.type)) {
                    result[input.name] = input.value;
                }

                return result;
            },
            {} // Initial 'result' object
        );
        /* eslint-enable */

        return initialValues;
    }

    createRefHandler = (refName) => (component) => {
        this.formRefs[refName] = component;

        const input = find(this.inputs, (inputObject) => inputObject.name === refName);

        if (input && typeof input.ref !== 'undefined') {
            if (
                input.ref
                && typeof input.ref === 'function'
            ) {
                input.ref(component);
            }
        }
    };

    getAutoCapitalize = (inputType) => {
        switch (inputType) {
            case 'email':
            case 'url':
            case 'password':
                return 'none';
            default:
                return 'sentences';
        }
    }

    getAutoCorrect = (inputType) => {
        switch (inputType) {
            case 'email':
            case 'url':
            case 'password':
                return false;
            default:
                return true;
        }
    }

    getKeyboardType = (inputType) => {
        switch (inputType) {
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

    getPlaceholder = (inputType) => {
        switch (inputType) {
            case 'email':
                return 'ie: test@example.com';
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

    getMaxLength = (inputType) => {
        switch (inputType) {
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

    getReturnKeyType = (input, index) => {
        const indexOfLastTextLikeInput = findLastIndex(
            this.inputs,
            (item) => includes(textLikeTypes, item.type)
        );

        if (input.type === 'textarea') {
            return 'default';
        } else if (index === indexOfLastTextLikeInput) {
            return 'go';
        } else {
            return 'next';
        }
    };

    createSubmitEditingHandler = (input) => {
        const index = findIndex(
            this.inputs,
            input
        );

        const nextInput = this.inputs[index + 1];

        if (!nextInput) {
            return;
        }

        if (includes(interactableTypes, nextInput.type)) {
            if (includes(textLikeTypes, nextInput.type)) {
                return () => {
                    if (
                        this.formRefs[nextInput.name]
                        && (
                            (
                                nextInput.hasOwnProperty('editable')
                                && nextInput.editable
                            )
                            || (
                                nextInput.hasOwnProperty('disabled')
                                && !nextInput.disabled
                            )
                            || (
                                !nextInput.hasOwnProperty('editable')
                                && !nextInput.hasOwnProperty('disabled')
                            )
                        )
                        && !nextInput.nextSkip
                    ) {
                        this.formRefs[nextInput.name].focus();
                    }
                };
            } else if (nextInput.nextSkip) {
                return this.createSubmitEditingHandler(nextInput);
            } else if (nextInput.type === 'submit') {
                //!\\ Call two times when the arrow is clicked on android
                return this.handleSubmit;

            } else if (nextInput.type === 'button') {
                return nextInput.onPress;
            } else if (nextInput.type === 'image' || nextInput.type === 'video') {
                // Open image picker
                return null;
            } else if (nextInput.type === 'file') {
                // Open file picker
                return null;
            } else {
                return () => {
                    if (this.formRefs[input.name]) {
                        this.formRefs[input.name].blur();
                    }
                };
            }
        }

        return null;
    };

    handleInputChange = (input, value, doOnChange = true) => {
        if (input.onChange) {
            input.onChange(value);
        }
        const newStateValue = {};

        newStateValue[input.name] = value;
        this.setState({
            values: {
                ...this.state.values,
                ...newStateValue,
            },
        });

        if (this.props.onChange && doOnChange) {
            this.props.onChange({ [input.name]: value });
        }
    };

    validateInput = (input, valueToCheck, errors) => {
        try {
            forEach(input.validationFunctions || [], (validationFunction, index) => { // eslint-disable-line
                let isInputValid = false;

                if (typeof validationFunction(valueToCheck) === 'function') {
                    isInputValid = validationFunction(valueToCheck)(this.state);
                } else {
                    isInputValid = validationFunction(valueToCheck);
                }

                if (!isInputValid) {
                    errors[input.name] = input.validationErrorMessages[index]; // eslint-disable-line

                    return false;
                }
            });
        } catch (error) {
            console.error('Error in validation', error.message);
        }
    }

    createInputValidator = (input) => (valueOrEvent) => {
        let valueToCheck = valueOrEvent;
        const formErrors = this.state.formErrors;

        if (typeof valueOrEvent === 'object' && valueOrEvent.hasOwnProperty('nativeEvent')) {
            valueToCheck = valueOrEvent.nativeEvent.text
                ? valueOrEvent.nativeEvent.text
                : this.state.values[input.name]; // On Android, onBlur doesn't give the value of the field
        }

        // Reinit error for this field before validation
        // We need to use `delete` because Reflect.deleteOwnProperty is not defined on certain android versions
        delete formErrors[input.name];

        if (this.state.values[input.name]) {
            this.validateInput(input, valueToCheck, formErrors); // Puts an error in formErrors if needed
        }

        return this.checkErrors(formErrors);
    };

    createInputChangeHandler = (input) => (newValue) => {
        if (newValue.hasOwnProperty('nativeEvent')) {
            newValue = newValue.nativeEvent.text; // eslint-disable-line
        }

        this.handleInputChange(input, newValue);
    };

    createSwitchChangeHandler = (input) => (value) => {
        this.handleInputChange(input, value);
    }

    createRadioCheckItemPressHandler = (input, option) => () => {
        if (option.onChange) {
            option.onChange(option.value);
        }

        this.handleInputChange(input, option.value);
    };

    createCheckboxesChangeHandler = (input, option) => (checked) => {
        const selectedBoxes = this.state.values[input.name];

        if (checked && selectedBoxes.indexOf(option.value)) {
            selectedBoxes.push(option.value);
        } else {
            selectedBoxes.splice(selectedBoxes.indexOf(option.value), 1);
        }
        if (option.onChange) {
            option.onChange(checked);
        }

        this.handleInputChange(input, selectedBoxes);
    };

    createPillsChangeHandler = (input, option) => () => {
        this.handleInputChange(input, option.value);
    };

    createPressHandler = (input) => {
        if (input.type === 'submit') {
            return this.handleSubmit;
        } else {
            return input.onPress;
        }
    }

    checkErrors = (errors) => {
        const isValid = Object.keys(errors).length === 0;

        this.setState({
            formErrors: errors,
            isValid,
        });

        return isValid;
    }

    validateAllFields = () => {
        const errors = {};

        forEach(this.inputs, (input) => {
            this.validateInput(input, this.state.values[input.name], errors);
        });

        return this.checkErrors(errors);
    }

    createInputFocusHandler = (input) => () => {
        if (this.formRefs[input.name]) {
            this.focusedInput = this.formRefs[input.name];
        }

        if (input.onFocus) {
            input.onFocus();
        }
    }

    handleSubmit = () => {
        if (this.focusedInput) {
            this.focusedInput.blur();
        }

        if (this.validateAllFields()) {
            this.props.onSubmit(this.state.values);
        }
    };

    handleSecureTextEntryChange = (input) => () => {
        const newStateSecureTextEntry = {};

        if (typeof this.state.secureTextEntry[input.name] === 'undefined') {
            newStateSecureTextEntry[input.name] = false;
        } else {
            newStateSecureTextEntry[input.name] = !this.state.secureTextEntry[input.name];
        }

        this.setState({
            secureTextEntry: {
                ...this.state.secureTextEntry,
                ...newStateSecureTextEntry,
            },
        });

        // v Hack to avoid the bug when secureTextEntry is changed
        // if (this.formRefs[input.name]) {
        //     this.formRefs[input.name].blur();
        //     setTimeout(() => {
        //         this.formRefs[input.name].focus();
        //     }, 300);
        // }
    }

    // XXX: Doing weird stuff on iOs, so I removed the button type
    // handleReset = () => {
    //     this.setState({
    //         values: this.getInitialValues(this.inputs),
    //     });
    // }

    renderIOSPickerButton = (input) => () => {
        const correspondingOption = this.state.values[input.name]
            ? find(input.options, (option) => option.value === this.state.values[input.name])
            : null;

        return (
            <View style={styles.IOSPickerButtonContent}>
                <Text>{input.buttonLabel || ''}</Text>
                <Text>
                    {correspondingOption
                        ? correspondingOption.label || correspondingOption.value
                        : translate('form.radio.notChosen')
                    }
                </Text>
            </View>
        );
    };

    createImageChoiceHandler = (input) => this.createImageOrVideoChoiceHandler(input, IMAGE_OPTIONS);
    createVideoChoiceHandler = (input) => this.createImageOrVideoChoiceHandler(input, VIDEO_OPTIONS);

    createImageOrVideoChoiceHandler = (input, baseOptions) => () => {
        const cloneBaseOptions = { ...baseOptions };

        if (Platform.OS === 'android' && input.multipleOption) {
            delete cloneBaseOptions.chooseFromLibraryButtonTitle;
        }

        try {
            NativeModules.ImagePickerManager.showImagePicker(
                {
                    ...cloneBaseOptions,
                    ...input.pickerOptions,
                },
                (response) => {
                    if (response.error) {
                        this.setState({
                            failed: true,
                        });
                        this.handleInputChange(input, response.error);
                        if (input.onChangeFailed) {
                            input.onChangeFailed();
                        }
                    } else if (response.customButton === 'multiple') {
                        MultipleImagePicker.openPicker({
                            multiple: true,
                            maxFiles: Math.max(5 - input.numberOfImagesAlreadySet, 0),
                        }).then((images) => {
                            return Promise.all(
                                images.slice(0, Math.max(5 - input.numberOfImagesAlreadySet, 0)).map((image) => {
                                    return ImageResizer.createResizedImage(image.path, IMAGE_OPTIONS.maxWidth, IMAGE_OPTIONS.maxWidth, 'JPEG', 80)
                                    .then((resizedImageUri) => {
                                        return new Promise((resolve, reject) => {
                                            Image.getSize(
                                                resizedImageUri,
                                                (width, height) => {
                                                    ImageEditor.cropImage(
                                                        resizedImageUri,
                                                        {
                                                            offset: {
                                                                x: 0,
                                                                y: 0,
                                                            },
                                                            size: {
                                                                width,
                                                                height,
                                                            },
                                                        },
                                                        (uri) => {
                                                            ImageStore.getBase64ForTag(
                                                                uri,
                                                                (imageBase64) => {
                                                                    resolve({
                                                                        uri,
                                                                        data: imageBase64,
                                                                        type: 'JPEG',
                                                                        width,
                                                                        height,
                                                                        isVertical: true,
                                                                    });
                                                                },
                                                                (error) => reject(error)
                                                            );
                                                        },
                                                        (error) => reject(error)
                                                    );
                                                },
                                                (error) => reject(error)
                                            );
                                        });
                                    });
                                })
                            )
                            .then((resizedImageObjects) => {
                                resizedImageObjects.forEach((image, index) => {
                                    if (index === 0) {
                                        this.handleInputChange(
                                            input,
                                            {
                                                ...image,
                                                data: `data:image/jpeg;base64,${image.data}`,
                                            },
                                            resizedImageObjects.length === 1
                                        );
                                    } else {
                                        const imageName = input.addImageInputFunc();

                                        this.handleInputChange(
                                            {
                                                ...input,
                                                name: imageName,
                                            },
                                            {
                                                ...image,
                                                data: `data:image/jpeg;base64,${image.data}`,
                                            },
                                            index === resizedImageObjects.length - 1
                                        );
                                    }
                                });

                                MultipleImagePicker.clean();
                            });
                        }).catch((error) => {
                            console.log(error);
                        });
                    } else if (response.didCancel) {
                        this.setState({
                            failed: false,
                        });
                        if (input.onCancel) {
                            input.onCancel();
                        }
                    } else {
                        const source = response;

                        source.data = `data:image/jpeg;base64,${response.data}`;
                        this.setState({
                            source,
                            failed: false,
                        });
                        this.handleInputChange(input, source);
                    }
                }
            );
        } catch (e) {
            this.setState({
                failed: true,
            });
            this.handleInputChange(input, 'Error');
            if (input.onChangeFailed) {
                input.onChangeFailed();
            }
        }
    };

    createResetFieldHandler = (input) => () => {
        const resetObject = { [input.name]: null };

        this.setState({
            values: {
                ...this.state.values,
                ...resetObject,
            },
        });

        this.handleInputChange(input, null);

        if (input.onChange) {
            input.onChange(resetObject);
        }
    };

    renderImageCustomInput = (inputObject, image) => {
        return (
            <TouchableHighlight
                style={inputObject.touchableHighlightStyle}
                underlayColor={'transparent'}
                onPress={this.createImageChoiceHandler(inputObject)}
            >
                <View
                    style={styles.imageUploadContainer}
                >
                    <View
                        style={styles.previewImageContainer}
                    >
                        <Image
                            style={styles.imageUploadPreview}
                            source={{ uri: image }}
                            key={`image-${inputObject.name}`}
                        />
                        <View style={styles.previewImageOverlay}>
                            <View style={styles.previewImageOverlayContainer}>
                                <Image
                                    style={styles.imageEditStyle}
                                    source={inputObject.iconEditImage}
                                />
                                <TouchableHighlight
                                    style={inputObject.touchableHighlightStyle}
                                    underlayColor={'transparent'}
                                    onPress={this.createResetFieldHandler(inputObject)}
                                >
                                    <Image
                                        style={styles.imageEditStyle}
                                        source={inputObject.iconRemoveImage}
                                    />
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View
                style={[
                    this.props.containerStyle,
                ]}
            >
                {this.props.formGroups.map((formGroup, formGroupsIndex) => {
                    const inputsRender = formGroup.inputs.map((inputObject, index) => {
                        let input = null;
                        let label = null;

                        // TODO : Image picker
                        // TODO : File picker
                        if (inputObject.type === 'hidden') {
                            return null;
                        } else if (inputObject.type === 'pills') {
                            input = (
                                <View>
                                    <View
                                        style={[
                                            styles.pillsContainerStyle,
                                            inputObject.style,
                                        ]}
                                    >
                                        {inputObject.options.map((item, optionIndex) => {
                                            return (
                                                <TouchableHighlight
                                                    key={`pill-${optionIndex}`}
                                                    style={[
                                                        styles.pillContainerStyle,
                                                        item.containerStyle,
                                                        this.state.values.type === item.value
                                                            ? item.selectedContainerStyle
                                                            : {},
                                                    ]}
                                                    underlayColor={item.underlayColor}
                                                    onPress={this.createPillsChangeHandler(inputObject, item)}
                                                >
                                                    <View>
                                                        <Text
                                                            style={[
                                                                styles.pillTextStyle,
                                                            ]}
                                                        >
                                                            {item.text}
                                                        </Text>
                                                    </View>
                                                </TouchableHighlight>
                                            );
                                        })}
                                    </View>
                                    {this.state.formErrors[inputObject.name]
                                        ? <Text style={styles.error}>
                                            {this.state.formErrors[inputObject.name]}
                                        </Text>
                                        : null
                                    }
                                </View>
                            );
                        } else if (inputObject.type === 'checkboxes') {
                            const CheckBoxComponent = inputObject.component ? inputObject.component : Checkbox;

                            input = (
                                <View style={inputObject.containerStyle}>
                                    {inputObject.options.map((item, optionIndex) => {
                                        return (
                                            <CheckBoxComponent
                                                key={`${inputObject.name}-option-${optionIndex}`}
                                                label={item.label}
                                                labelBefore={item.labelBefore}
                                                labelContainerStyle={[
                                                    styles.checkboxLabelContainer,
                                                    inputObject.labelContainerStyle,
                                                ]}
                                                labelStyle={[
                                                    styles.checkboxLabel,
                                                    inputObject.labelStyle,
                                                ]}
                                                checked={typeof (item.checked) !== 'undefined' ? item.checked : includes(this.state.values[inputObject.name], item.value)}
                                                checkedImage={item.checkedImage || require('HeyNeighburz/app/images/checkbox-checked.png')}
                                                uncheckedImage={item.uncheckedImage || require('HeyNeighburz/app/images/checkbox-unchecked.png')}
                                                onChange={this.createCheckboxesChangeHandler(
                                                    inputObject,
                                                    item
                                                )}
                                                style={[styles.checkbox, inputObject.style]}
                                                checkboxStyle={[
                                                    styles.checkboxBoxStyle,
                                                    inputObject.checkboxStyle,
                                                ]}
                                            />
                                        );
                                    })}
                                </View>
                            );
                        } else if (inputObject.type === 'checkbox') {
                            let CheckBoxComponent = inputObject.component ? inputObject.component : Checkbox;

                            input = (
                                <CheckBoxComponent
                                    {...inputObject}
                                    containerStyle={styles.checkboxContainerStyle}
                                    onChange={this.createInputChangeHandler(inputObject)}
                                    checkboxStyle={styles.checkboxBoxStyle}
                                    checked={this.state.values[inputObject.name] || inputObject.checked}
                                    label={inputObject.checkboxLabel}
                                    labelContainerStyle={[
                                        styles.checkboxLabelContainer,
                                        inputObject.labelContainerStyle,
                                    ]}
                                    labelStyle={[
                                        styles.checkboxLabelContainer,
                                        inputObject.labelStyle,
                                    ]}
                                    checkedImage={inputObject.checkedImage || require('HeyNeighburz/app/images/checkbox-checked.png')}
                                    uncheckedImage={inputObject.uncheckedImage || require('HeyNeighburz/app/images/checkbox-unchecked.png')}
                                />
                            );
                        } else if (inputObject.type === 'radio') {
                            input = (
                                <Picker
                                    selectedValue={typeof this.state.values[inputObject.name] !== 'undefined' ? this.state.values[inputObject.name] : inputObject.selectedValue}
                                    onValueChange={this.createInputChangeHandler(inputObject)}
                                    style={styles.picker || inputObject.pickerStyle}
                                >
                                    {inputObject.options.map((item, optionIndex) => (
                                        <Picker.Item
                                            key={`${inputObject.name}-option-${optionIndex}`}
                                            label={item.label || item.value}
                                            value={item.value}
                                        />))}
                                </Picker>
                            );

                            if (Platform.OS === 'ios') {
                                input = (
                                    <Modal
                                        renderButtonContent={this.renderIOSPickerButton(inputObject)}
                                        buttonContainerStyle={styles.IOSPickerButton}
                                        alignContent={'bottom'}
                                        contentStyle={styles.radioContent}
                                    >
                                        {input}
                                    </Modal>
                                );
                            }
                        } else if (inputObject.type === 'radio-check') {
                            input = (
                                <View
                                    style={[
                                        styles.radioCheckItemsContainer,
                                        inputObject.itemsContainerStyle,
                                    ]}
                                >
                                    {inputObject.options.map((item, optionIndex) => (
                                        <TouchableHighlight
                                            key={`${inputObject.name}-option-${optionIndex}`}
                                            underlayColor={colors.lighterTransparentGrey}
                                            onPress={this.createRadioCheckItemPressHandler(inputObject, item)}
                                        >
                                            <View
                                                style={[
                                                    styles.radioCheckItemContainer,
                                                    item.containerStyle,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.radioCheckItemLabel,
                                                        item.labelStyle,
                                                    ]}
                                                >
                                                    {item.label}
                                                </Text>
                                                {this.state.values[inputObject.name] === item.value
                                                    ? <View style={styles.radioCheckCheckedIconContainer}>
                                                        <Image
                                                            source={inputObject.checkedIcon || defaultCheckedIcon}
                                                            style={styles.radioCheckCheckedIcon}
                                                        />
                                                    </View>
                                                    : null
                                                }
                                            </View>
                                        </TouchableHighlight>
                                    ))}
                                </View>
                            );
                        } else if (inputObject.type === 'range') {
                            input = (
                                <Slider
                                    {...inputObject}
                                    onValuesChangeFinish={this.createInputChangeHandler(inputObject)}
                                />
                            );
                        } else if (includes(textLikeTypes, inputObject.type)) {
                            const TextInputComponent = inputObject.component ? inputObject.component : TextInput;

                            input = (
                                <TextInputComponent
                                    key={`${inputObject.name}-input-${index}`}
                                    {...inputObject}
                                    autoCapitalize={this.getAutoCapitalize(inputObject.type)}
                                    autoCorrect={typeof inputObject.autoCorrect === 'undefined' ? this.getAutoCorrect(inputObject.type) : inputObject.autoCorrect}
                                    editable={!inputObject.disabled}
                                    error={this.state.formErrors[inputObject.name]}
                                    keyboardType={this.getKeyboardType(inputObject.type)}
                                    multiline={inputObject.type === 'textarea'}
                                    onSubmitEditing={inputObject.type !== 'textarea'
                                        ? this.createSubmitEditingHandler(inputObject)
                                        : null
                                    }
                                    style={[
                                        inputObject.type === 'textarea'
                                            ? styles.textareaInput
                                            : {},
                                        inputObject.style,
                                    ]}
                                    onFocus={this.createInputFocusHandler(inputObject)}
                                    onChange={this.createInputChangeHandler(inputObject)}
                                    onBlur={this.createInputValidator(inputObject)}
                                    placeholder={inputObject.hasOwnProperty('placeholder')
                                        ? inputObject.placeholder
                                        : this.getPlaceholder(inputObject.type)
                                    }
                                    placeholderTextColor={this.props.placeholderTextColor || colors.veryLightGrey}
                                    ref={this.createRefHandler(inputObject.name)}
                                    returnKeyType={this.props.returnKeyType || this.getReturnKeyType(inputObject, index)}
                                    secureTextEntry={
                                        (inputObject.type === 'password' || inputObject.secureTextEntry)
                                        && (this.state.secureTextEntry[inputObject.name] === undefined
                                            ? true
                                            : this.state.secureTextEntry[inputObject.name])
                                    }
                                    value={typeof this.state.values[inputObject.name] !== 'undefined'
                                        ? this.state.values[inputObject.name]
                                        : inputObject.value
                                    }
                                />
                            );

                            if (inputObject.inputIcon) {
                                let icon = null;

                                if (typeof inputObject.inputIcon === 'number') {
                                    icon = (
                                        <TouchableHighlight
                                            onPress={this.handleSecureTextEntryChange(inputObject)}
                                            underlayColor={colors.transparent}
                                            style={[styles.inputTouchableIconStyle]}
                                        >
                                            <Image
                                                style={[
                                                    styles.inputIconStyle,
                                                    inputObject.type === 'password' && (
                                                        this.state.secureTextEntry[inputObject.name]
                                                        || typeof this.state.secureTextEntry[inputObject.name] === 'undefined'
                                                    )
                                                        ? styles.inactivePasswordIcon
                                                        : {},
                                                ]}
                                                source={inputObject.inputIcon}
                                            />
                                        </TouchableHighlight>
                                    );
                                } else if (typeof inputObject.inputIcon === 'function') {
                                    const Icon = inputObject.inputIcon;

                                    icon = (
                                        <Icon
                                            style={[
                                                styles.inputIconStyle,
                                                inputObject.type === 'password' && (
                                                    this.state.secureTextEntry[inputObject.name]
                                                    || typeof this.state.secureTextEntry[inputObject.name] === 'undefined'
                                                )
                                                    ? styles.inactivePasswordIcon
                                                    : {},
                                            ]}
                                            color={inputObject.activityIndicatorStyle}
                                        />
                                    );
                                }

                                const inputIcon = icon
                                    ? <View
                                        style={this.state.formErrors[inputObject.name]
                                            ? styles.changeSecureTextContainerErrorStyle
                                            : styles.changeSecureTextContainerStyle
                                        }
                                    >
                                        {icon}
                                    </View>
                                    : null;

                                input = (
                                    <View style={styles.passwordInputContainer}>
                                        {input}
                                        {inputIcon}
                                    </View>
                                );
                            }
                        } else if (includes(buttonLikeTypes, inputObject.type)) {
                            const ButtonComponent = inputObject.component ? inputObject.component : Button;

                            input = (
                                <ButtonComponent
                                    {...inputObject}
                                    onPress={this.createPressHandler(inputObject)}
                                />
                            );
                        } else if (inputObject.type === 'imageCustom') {
                            let limit = -1;

                            formGroup.inputs.forEach((tInput) => {
                                if (tInput.type === 'imageCustom') {
                                    limit += 1;
                                }
                            });

                            const modifiedInput = {
                                ...inputObject,
                                ...(
                                    inputObject.multipleOption
                                    ? {
                                        pickerOptions: {
                                            customButtons: [
                                                {
                                                    name: 'multiple',
                                                    title: translate('form.imagePicker.selectMultipleImages'),
                                                },
                                            ],
                                        },
                                    }
                                    : {}
                                ),
                            };

                            if (
                                (this.state.values[inputObject.name]
                                && typeof this.state.values[inputObject.name].data !== 'undefined')
                            ) {
                                input = this.renderImageCustomInput(modifiedInput, this.state.values[inputObject.name].data);
                            } else if (inputObject.source) {
                                input = this.renderImageCustomInput(modifiedInput, inputObject.source);
                            } else {
                                let text;

                                if (limit < inputObject.imagesUploadLimit) {
                                    text = (limit === 0)
                                        ? translate('posts.uploadPhoto')
                                        : `You can upload ${inputObject.imagesUploadLimit - limit} photos`;

                                    input = (
                                        <TouchableHighlight
                                            style={inputObject.touchableHighlightStyle}
                                            underlayColor={'transparent'}
                                            onPress={this.createImageChoiceHandler(modifiedInput)}
                                        >
                                            <View
                                                style={styles.imageUploadContainer}
                                            >
                                                <View style={{ alignItems: 'center' }}>
                                                    <Image
                                                        style={styles.imageUploadStyle}
                                                        source={inputObject.iconAddImage}
                                                    />
                                                    <Text
                                                        style={styles.textUploadStyle}
                                                    >
                                                        {text}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    );
                                }
                            }
                        } else if (inputObject.type === 'image' || inputObject.type === 'video') {
                            let removeButton;

                            if (
                                this.state.values[inputObject.name]
                                && inputObject.hideRemoveButton === false
                            ) {
                                const ButtonComponent = inputObject.buttonComponent ? inputObject.buttonComponent : Button;

                                removeButton = (<ButtonComponent
                                    onPress={this.createResetFieldHandler(inputObject)}
                                    text={translate(`form.imagePicker.${inputObject.type}Remove`)}
                                    containerStyle={{ width: 150 }}
                                />);
                            }

                            if (inputObject.imageButton) {
                                let source;

                                if (this.state.values[inputObject.name]) {
                                    if (typeof this.state.values[inputObject.name] === 'object' && typeof this.state.values[inputObject.name].data !== 'undefined') {
                                        source = { uri: this.state.values[inputObject.name].data };
                                    } else if (typeof this.state.values[inputObject.name] === 'number') {
                                        source = this.state.values[inputObject.name];
                                    } else if (typeof this.state.values[inputObject.name] === 'string') {
                                        source = { uri: this.state.values[inputObject.name] };
                                    }
                                } else if (inputObject.url) {
                                    source = { uri: inputObject.url };
                                } else {
                                    source = inputObject.imageButton;
                                }

                                const imageIcon = inputObject.imageIcon
                                    ? <Image
                                        key={`image-${inputObject.name}-icon`}
                                        source={inputObject.imageIcon}
                                        style={styles.imageButtonIconStyle}
                                    />
                                    : null;

                                input = (
                                    <View style={inputObject.style}>
                                        <View style={styles.imageButtonContainerStyle}>
                                            <TouchableHighlight
                                                style={inputObject.touchableHighlightStyle}
                                                underlayColor={'transparent'}
                                                onPress={inputObject.type === 'image'
                                                    ? this.createImageChoiceHandler(inputObject)
                                                    : this.createVideoChoiceHandler(inputObject)
                                                }
                                            >
                                                <View>
                                                    <Image
                                                        key={`image-${inputObject.name}`}
                                                        source={source}
                                                        {...inputObject.imageOptions}
                                                    />
                                                    {imageIcon}
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                        <View style={styles.imageButtonContainerStyle}>
                                            {removeButton}
                                        </View>
                                    </View>
                                );
                            } else {
                                input = [
                                    this.state.values[inputObject.name] && typeof this.state.values[inputObject.name].data !== 'undefined'
                                        ? <Button
                                            containerStyle={styles.buttonRemove}
                                            onPress={this.createResetFieldHandler(inputObject)}
                                        >
                                            <View style={styles.previewContainer}>
                                                <View style={styles.previewImageContainer}>
                                                    <Image
                                                        style={styles.previewImage}
                                                        source={{ uri: this.state.values[inputObject.name].data }}
                                                        key={`${inputObject.name}-preview`}
                                                    />
                                                </View>
                                                <View style={styles.removeText}>
                                                    <Text>{translate(`form.imagePicker.${inputObject.type}Remove`)}</Text>
                                                </View>
                                            </View>
                                        </Button>
                                        : null,
                                    <Button
                                        key={`image-${inputObject.name}`}
                                        text={inputObject.label || this.state.values[inputObject.name]
                                            ? translate(`form.imagePicker.${inputObject.type}Change`)
                                            : translate(`form.imagePicker.${inputObject.type}PickerButtonTitle`)
                                        }
                                        {...inputObject.buttonOptions}
                                        onPress={inputObject.type === 'image'
                                            ? this.createImageChoiceHandler(inputObject)
                                            : this.createVideoChoiceHandler(inputObject)
                                        }
                                    />
                                ];
                            }
                        } else if (includes(temporalTypes, inputObject.type)) {
                            input = (
                                <DateTimePicker
                                    {...inputObject}
                                    label={inputObject.inputLabel}
                                    date={this.state.values[inputObject.name]}
                                    mode={inputObject.type}
                                    onChange={this.createInputChangeHandler(inputObject)}
                                />
                            );
                        } else if (inputObject.type === 'separator') {
                            input = (
                                <View
                                    key={`seperator-${index}`}
                                    style={[
                                        styles.separator,
                                        inputObject.style,
                                    ]}
                                />
                            );
                        } else if (inputObject.type === 'switch') {
                            if (Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version >= 21)) {
                                input = (
                                    <Switch
                                        {...inputObject}
                                        onValueChange={this.createSwitchChangeHandler(inputObject)}
                                        value={typeof this.state.values[inputObject.name] !== 'undefined' ? this.state.values[inputObject.name] : inputObject.value}
                                    />
                                );
                            } else {
                                const isSet = typeof this.state.values[inputObject.name] !== 'undefined' ? this.state.values[inputObject.name] : inputObject.value;

                                input = (
                                    <TouchableHighlight
                                        underlayColor={colors.lighterTransparentGrey}
                                        onPress={() => this.handleInputChange(inputObject, !isSet)}
                                    >
                                        {isSet
                                            ? <Text style={styles.onOffText}>{translate('form.true')}</Text>
                                            : <Text style={styles.onOffText}>{translate('form.false')}</Text>
                                        }
                                    </TouchableHighlight>
                                );
                            }
                        }

                        if (!input) {
                            console.log(
                                'Input type unrecognized',
                                inputObject.type,
                                '. Ignoring field "',
                                inputObject.name,
                                '"'
                            );

                            return null;
                        }

                        if (inputObject.label) {
                            label = (
                                <Text
                                    style={[
                                        styles.label,
                                        this.props.labelStyle,
                                        inputObject.labelStyle,
                                    ]}
                                >
                                    {inputObject.label}
                                </Text>
                            );
                        }

                        return (
                            <View
                                key={`${inputObject.name}-input-${index}`}
                                style={[
                                    styles.inputContainer,
                                    this.props.inputContainerStyle,
                                    inputObject.inputContainerStyle,
                                ]}
                            >
                                {label}
                                {input}
                            </View>
                        );
                    });

                    return (
                        <View
                            style={[styles.formGroupContainer, formGroup.style]}
                            key={`formGroup-input-${formGroupsIndex}`}
                        >
                            {formGroup.insertBefore}
                            {inputsRender}
                            {formGroup.insertAfter}
                        </View>
                    )
                })}
            </View>
        );
    }
}
