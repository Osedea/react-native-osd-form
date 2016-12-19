import React from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import ImagePickerManager from 'react-native-image-picker';

import Input from '../Input';
import colors from '../colors';
import { formMediaInputAcceptedTypes } from './types';

const styles = StyleSheet.create({
    callToActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 5,
    },
    touchable: {
        flex: 0,
        marginLeft: 10,
    },
    firstTouchable: {
        marginLeft: 0,
    },
    multipleActionsTouchable: {
        flex: 1,
    },
    action: {
        flex: 1,
        minHeight: 40,
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: Platform.OS === 'android' ? 2 : 0,
        paddingTop: 8,
        paddingBottom: 8,
        shadowOffset: {
            height: 4,
        },
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        ...(Platform.OS === 'android'
            ? {
                borderTopWidth: 1,
                borderTopColor: colors.reallyLightGrey,
            }
            : {}
        ),
    },
    singleAction: {
        width: 180,
        padding: 10,
    },
    multipleActionsContainer: {
        paddingLeft: 5,
        paddingRight: 5,
        alignItems: 'center',
    },
    threeOrMore: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    smallPadding: {
        paddingLeft: 2,
        paddingRight: 2,
    },
    actionIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    multipleActionsIcon: {
        marginRight: 5,
    },
    moreThanThreeIcon: {
        marginRight: 0,
        marginBottom: 3,
    },
    actionText: {
        fontSize: 12,
        color: colors.lightGrey,
    },
    multipleActionsText: {
        marginRight: 0,
        textAlign: 'center',
    },
    ambassadressMultipleActionsText: {
        fontSize: 8,
    },
    imagePreview: {
        position: 'absolute',
        top: 1,
        left: 1,
        width: 38,
        height: 38,
        marginRight: 5,
    },
    previewContainer: {
        paddingLeft: 45,
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

    selectImage = () => {
        ImagePickerManager.showImagePicker(this.IMAGE_OPTIONS, (response) => {
            if (response.error) {
                this.setState({ error: 'imageFailed' });
            } else if (response.didCancel) {
                // Do nothing
            } else {
                response.data = `data:image/jpeg;base64,${response.data}`;
                this.handleMediaValue(response);
            }
        });
    };

    deleteImage = () => {
        this.handleMediaValue('');
    };

    handleMediaValue = (value) => {
        this.handleChange(value);
        this.handleInputEnd();
    }

    render() {
        const actions = [
            ...(this.state.value
                ? [{
                    key: 'preview',
                    onPress: this.deleteImage,
                    text: 'Delete Image',
                    iconStyle: styles.imagePreview,
                    iconResizeMode: 'cover',
                    icon: { uri: typeof this.state.value === 'object' ? this.state.value.data : this.state.value },
                    containerStyle: styles.previewContainer,
                }]
                : []
            ),
            {
                key: 'addOrChange',
                onPress: this.selectImage,
                text: this.state.value
                    ? 'Change Image'
                    : 'Add Image',
                iconStyle: { tintColor: this.props.color },
                icon: require('../images/image.png'),
            },
        ];

        const input = (
            <View
                style={styles.callToActions}
            >
                {actions.map((action, index) => {
                    if (action === null) {
                        return null;
                    }

                    return (
                        <TouchableHighlight
                            underlayColor={colors.veryLightTransparentGrey}
                            onPress={action.onPress}
                            key={action.key}
                            elevation={1}
                            style={[
                                styles.touchable,
                                index === 0
                                    ? styles.firstTouchable
                                    : null,
                                actions.length > 1
                                    ? styles.multipleActionsTouchable
                                    : null,
                                action.touchableStyle,
                            ]}
                        >
                            <View
                                style={[
                                    styles.action,
                                    actions.length > 1
                                        ? styles.multipleActionsContainer
                                        : styles.singleAction,
                                    action.containerStyle,
                                ]}
                            >
                                {action.loading
                                    ? <ActivityIndicator
                                        size={'small'}
                                        style={styles.actionIcon}
                                    />
                                    : null
                                }
                                {!action.loading && action.icon
                                    ? <Image
                                        source={action.icon || this.props.defaultIcon}
                                        resizeMode={action.iconResizeMode || 'contain'}
                                        style={[
                                            styles.actionIcon,
                                            actions.length > 1
                                                ? styles.multipleActionsIcon
                                                : null,
                                            this.props.actionsIconStyle,
                                            action.iconStyle,
                                        ]}
                                    />
                                    : null
                                }
                                <Text
                                    style={[
                                        styles.actionText,
                                        actions.length > 1
                                            ? styles.multipleActionsText
                                            : null,
                                        this.props.actionsTextStyle,
                                        action.textStyle,
                                    ]}
                                >
                                    {action.text}
                                </Text>
                            </View>
                        </TouchableHighlight>
                    );
                })}
            </View>
        );

        return super.render(input);
    }
}
