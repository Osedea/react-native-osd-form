import React from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    View,
} from 'react-native';

import Input from '../Input';
import colors from '../colors';

const styles = StyleSheet.create({
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
});

export default class FormPills extends Input {
    static type = 'pills';

    static propTypes = {
        options: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                label: React.PropTypes.string,
                value: React.PropTypes.string,
            })
        ),
        style: View.propTypes.style,
        type: React.PropTypes.oneOf(['pills']),
        ...Input.propTypes,
    };

    createPillsChangeHandler = (option) => () => {
        this.handleChange(option.value);
        this.handleInputEnd();
    };

    render() {
        return super.render(
            <View>
                <View
                    style={[
                        styles.pillsContainerStyle,
                        this.props.style,
                    ]}
                >
                    {this.props.options.map((item, optionIndex) => {
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
                                underlayColor={item.underlayColor || colors.touchableUnderlayColor}
                                onPress={this.createPillsChangeHandler(item)}
                                ref={this.handleRef}
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
                {this.state.formErrors[this.props.name]
                    ? <Text style={styles.error}>
                        {this.state.formErrors[this.props.name]}
                    </Text>
                    : null
                }
            </View>
        );
    }
}
