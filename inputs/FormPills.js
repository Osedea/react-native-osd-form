import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';

import Input from '../Input';
import colors from '../colors';
import { formPillsType } from './types';

const styles = StyleSheet.create({
    pillsContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    pillContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: colors.transparent,
        padding: 10,
    },
    selectedContainerStyle: {
        borderBottomColor: colors.black,
        backgroundColor: colors.reallyLightTransparentGrey,
    },
    selectedStyle: {
        fontWeight: 'bold',
    },
});

export default class FormPills extends Input {
    static type = formPillsType;

    static propTypes = {
        containerStyle: View.propTypes.style,
        options: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                value: React.PropTypes.string,
                underlayColor: React.PropTypes.string,
                containerStyle: View.propTypes.style,
                selectedContainerStyle: View.propTypes.style,
                selectedStyle: Text.propTypes.style,
                textStyle: Text.propTypes.style,
            })
        ),
        pillContainerStyle: View.propTypes.style,
        pillSelectedContainerStyle: View.propTypes.style,
        pillSelectedTextStyle: Text.propTypes.style,
        pillTextStyle: Text.propTypes.style,
        type: React.PropTypes.oneOf([FormPills.type]),
        ...Input.propTypes,
    };

    static defaultProps = {
        customize: {},
    };

    createPillsChangeHandler = (option) => () => {
        this.handleChange(option.value);
        this.handleInputEnd();
    };

    render() {
        return super.render(
            <View
                style={[
                    styles.pillsContainerStyle,
                    this.props.customize.FormPillsContainerStyle,
                    this.props.containerStyle,
                ]}
            >
                {this.props.options.map((item, optionIndex) => (
                    <TouchableHighlight
                        key={`pill-${optionIndex}`}
                        underlayColor={item.underlayColor || this.props.customize.FormPillsUnderlayColor || colors.touchableUnderlayColor}
                        onPress={this.createPillsChangeHandler(item)}
                        ref={this.handleRef}
                    >
                        <View
                            style={[
                                styles.pillContainerStyle,
                                this.props.customize.FormPillsPillContainerStyle,
                                this.props.pillContainerStyle,
                                item.containerStyle,
                                ...(this.state.value === item.value
                                    ? [
                                        styles.selectedContainerStyle,
                                        item.selectedContainerStyle,
                                        this.props.customize.FormPillsPillSelectedContainerStyle,
                                        this.props.pillSelectedContainerStyle,
                                    ]
                                    : []
                                ),
                            ]}
                        >
                            <Text
                                style={[
                                    this.props.customize.FormPillsPillTextStyle,
                                    this.props.pillTextStyle,
                                    item.textStyle,
                                    ...(this.state.value === item.value
                                        ? [
                                            styles.selectedStyle,
                                            item.selectedStyle,
                                            this.props.customize.FormPillsPillSelectedStyle,
                                            this.props.pillSelectedTextStyle,
                                        ]
                                        : []
                                    ),
                                ]}
                            >
                                {item.label}
                            </Text>
                        </View>
                    </TouchableHighlight>
                ))}
            </View>
        );
    }
}
