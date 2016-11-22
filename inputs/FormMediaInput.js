import React from 'react';
import {
    Image,
    ImageEditor,
    ImageStore,
    Platform,
    StyleSheet,
    TouchableHighlight,
    View,
} from 'react-native';
import MultipleImagePicker from 'react-native-image-crop-picker';
import ImagePickerManager from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

import Input from '../Input';
import colors from '../colors';
import { formMediaInputAcceptedTypes } from './types';

const styles = StyleSheet.create({
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
        backgroundColor: colors.lightGrey,
        borderWidth: 0,
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
        flex: 1,
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
        flex: 1,
        height: 110 - 4,
        backgroundColor: colors.previewOverlay,
    },
    previewImageOverlayContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default class FormMediaInput extends Input {
    static acceptedTypes = formMediaInputAcceptedTypes;

    // For more info, see https://github.com/marcshilling/react-native-image-picker#options
    static propTypes = {
        onCancel: React.PropTypes.func,
        onChangeFailed: React.PropTypes.func,
        pickerOptions: React.PropTypes.object,
        type: React.PropTypes.oneOf(FormMediaInput.acceptedTypes),
        ...Input.propTypes,
    };

    IMAGE_OPTIONS = {
        title: 'Pick your image',
        cancelButtonTitle: 'Cancel',
        takePhotoButtonTitle: 'Take picture',
        chooseFromLibraryButtonTitle: 'Pick from Library',
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

    VIDEO_OPTIONS = {
        title: 'Pick your video',
        cancelButtonTitle: 'Cancel',
        takePhotoButtonTitle: 'Take picture',
        chooseFromLibraryButtonTitle: 'Pick from Library',
        mediaType: 'video',
        videoQuality: 'low', // 'low' or 'high' ('medium' is available for iOs but let's stick to cross-platform values)
        storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
            skipBackup: true, // ios only - image will NOT be backed up to icloud
            path: 'videos', // ios only - will save image at /Documents/images rather than the root
        },
        maxWidth: 800,
        cameraType: 'back',
    };


    createImageChoiceHandler = (input) => this.createImageOrVideoChoiceHandler(input, this.IMAGE_OPTIONS);
    createVideoChoiceHandler = (input) => this.createImageOrVideoChoiceHandler(input, this.VIDEO_OPTIONS);

    createImageOrVideoChoiceHandler = (baseOptions) => () => {
        const cloneBaseOptions = { ...baseOptions };

        if (Platform.OS === 'android' && this.props.multipleOption) {
            delete cloneBaseOptions.chooseFromLibraryButtonTitle;
        }

        try {
            ImagePickerManager.showImagePicker(
                {
                    ...cloneBaseOptions,
                    ...this.props.pickerOptions,
                },
                (response) => {
                    if (response.error) {
                        this.setState({
                            failed: true,
                        });
                        this.handleInputChange(this.props, response.error);
                        if (this.props.onChangeFailed) {
                            this.props.onChangeFailed();
                        }
                    } else if (response.customButton === 'multiple') {
                        MultipleImagePicker.openPicker({
                            multiple: true,
                            maxFiles: Math.max(5 - this.props.numberOfImagesAlreadySet, 0),
                        }).then((images) => {
                            return Promise.all(
                                images.slice(0, Math.max(5 - this.props.numberOfImagesAlreadySet, 0)).map((image) => {
                                    return ImageResizer.createResizedImage(image.path, this.IMAGE_OPTIONS.maxWidth, this.IMAGE_OPTIONS.maxWidth, 'JPEG', 80)
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
                                            this.props,
                                            {
                                                ...image,
                                                data: `data:image/jpeg;base64,${image.data}`,
                                            },
                                            resizedImageObjects.length === 1
                                        );
                                    } else {
                                        const imageName = this.props.addImageInputFunc();

                                        this.handleInputChange(
                                            {
                                                ...this.props,
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
                                this.handleInputEnd();
                            });
                        }).catch((error) => {
                            console.log(error);
                        });
                    } else if (response.didCancel) {
                        this.setState({
                            failed: false,
                        });
                        if (this.props.onCancel) {
                            this.props.onCancel();
                        }
                        this.handleInputEnd();
                    } else {
                        const source = response;

                        source.data = `data:image/jpeg;base64,${response.data}`;
                        this.setState({
                            source,
                            failed: false,
                        });
                        this.handleChange(source);
                        this.handleInputEnd();
                    }
                }
            );
        } catch (e) {
            this.setState({
                failed: true,
            });
            this.handleChange('Error');
            if (this.props.onChangeFailed) {
                this.props.onChangeFailed();
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

        this.handleChange(null);

        if (input.onChange) {
            input.onChange(resetObject);
        }
    };

    renderImageCustomInput = (image) => {
        return (
            <TouchableHighlight
                style={this.props.touchableHighlightStyle}
                underlayColor={colors.touchableUnderlayColor}
                onPress={this.createImageChoiceHandler(this.props)}
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
                            key={`image-${this.props.name}`}
                        />
                        <View style={styles.previewImageOverlay}>
                            <View style={styles.previewImageOverlayContainer}>
                                <Image
                                    style={styles.imageEditStyle}
                                    source={this.props.iconEditImage}
                                />
                                <TouchableHighlight
                                    style={this.props.touchableHighlightStyle}
                                    underlayColor={colors.touchableUnderlayColor}
                                    onPress={this.createResetFieldHandler(this.props)}
                                >
                                    <Image
                                        style={styles.imageEditStyle}
                                        source={this.props.iconRemoveImage}
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
        let input;

        if (this.props.type === 'custom') {
            let limit = -1;

            formGroup.inputs.forEach((tInput) => {
                if (tInput.type === 'imageCustom') {
                    limit += 1;
                }
            });

            const modifiedInput = {
                ...this.props,
                ...(
                    this.props.multipleOption
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
                (this.state.values[this.props.name]
                && typeof this.state.values[this.props.name].data !== 'undefined')
            ) {
                input = this.renderImageCustomInput(modifiedInput, this.state.values[this.props.name].data);
            } else if (this.props.source) {
                input = this.renderImageCustomInput(modifiedInput, this.props.source);
            } else {
                let text;

                if (limit < this.props.imagesUploadLimit) {
                    text = (limit === 0)
                        ? translate('posts.uploadPhoto')
                        : `You can upload ${this.props.imagesUploadLimit - limit} photos`;

                    input = (
                        <TouchableHighlight
                            style={this.props.touchableHighlightStyle}
                            underlayColor={colors.touchableUnderlayColor}
                            onPress={this.createImageChoiceHandler(modifiedInput)}
                        >
                            <View
                                style={styles.imageUploadContainer}
                            >
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        style={styles.imageUploadStyle}
                                        source={this.props.iconAddImage}
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
        } else {
            let removeButton;

            if (
                this.state.values[this.props.name]
                && this.props.hideRemoveButton === false
            ) {
                const ButtonComponent = this.props.buttonComponent ? this.props.buttonComponent : Button;

                removeButton = (<ButtonComponent
                    onPress={this.createResetFieldHandler(this.props)}
                    text={translate(`form.imagePicker.${this.props.type}Remove`)}
                    containerStyle={{ width: 150 }}
                />);
            }

            if (this.props.imageButton) {
                let source;

                if (this.state.values[this.props.name]) {
                    if (typeof this.state.values[this.props.name] === 'object' && typeof this.state.values[this.props.name].data !== 'undefined') {
                        source = { uri: this.state.values[this.props.name].data };
                    } else if (typeof this.state.values[this.props.name] === 'number') {
                        source = this.state.values[this.props.name];
                    } else if (typeof this.state.values[this.props.name] === 'string') {
                        source = { uri: this.state.values[this.props.name] };
                    }
                } else if (this.props.url) {
                    source = { uri: this.props.url };
                } else {
                    source = this.props.imageButton;
                }

                const imageIcon = this.props.imageIcon
                    ? <Image
                        key={`image-${this.props.name}-icon`}
                        source={this.props.imageIcon}
                        style={styles.imageButtonIconStyle}
                    />
                    : null;

                input = (
                    <View style={this.props.style}>
                        <View style={styles.imageButtonContainerStyle}>
                            <TouchableHighlight
                                style={this.props.touchableHighlightStyle}
                                underlayColor={'transparent'}
                                onPress={this.props.type === 'image'
                                    ? this.createImageChoiceHandler(this.props)
                                    : this.createVideoChoiceHandler(this.props)
                                }
                            >
                                <View>
                                    <Image
                                        key={`image-${this.props.name}`}
                                        source={source}
                                        {...this.props.imageOptions}
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
                    this.state.values[this.props.name] && typeof this.state.values[this.props.name].data !== 'undefined'
                        ? <Button
                            containerStyle={styles.buttonRemove}
                            onPress={this.createResetFieldHandler(this.props)}
                        >
                            <View style={styles.previewContainer}>
                                <View style={styles.previewImageContainer}>
                                    <Image
                                        style={styles.previewImage}
                                        source={{ uri: this.state.values[this.props.name].data }}
                                        key={`${this.props.name}-preview`}
                                    />
                                </View>
                                <View style={styles.removeText}>
                                    <Text>{translate(`form.imagePicker.${this.props.type}Remove`)}</Text>
                                </View>
                            </View>
                        </Button>
                        : null,
                    <Button
                        key={`image-${this.props.name}`}
                        text={this.props.label || this.state.values[this.props.name]
                            ? translate(`form.imagePicker.${this.props.type}Change`)
                            : translate(`form.imagePicker.${this.props.type}PickerButtonTitle`)
                        }
                        {...this.props.buttonOptions}
                        onPress={this.props.type === 'image'
                            ? this.createImageChoiceHandler(this.props)
                            : this.createVideoChoiceHandler(this.props)
                        }
                    />
                ];
            }
        }

        return super.render(input);
    }
}
