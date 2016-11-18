import React from 'react';
import {
    StyleSheet,
} from 'react-native';
import Checkbox from 'react-native-checkbox';

import Input from '../Input';
import colors from '../colors';

const styles = StyleSheet.create({
    checkboxContainerStyle: {
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    checkboxLabelContainer: {
    },
    checkboxLabel: { color: colors.white },
    checkboxBoxStyle: {
        width: 17,
        height: 17,
        margin: 1,
    },
});

export default class FormCheckbox extends Input {
    static type = 'checkbox';

    static propTypes = {
        checkboxLabel: React.PropTypes.string,
        type: React.PropTypes.oneOf(['checkbox']),
        ...Input.propTypes,
    };

    static defaultProps = {
        checkedImage: require('../images/checkbox-checked.png'),
        uncheckedImage: require('../images/checkbox-unchecked.png'),
    };

    handleCheckboxChange = (value) => {
        this.handleChange(value);
        this.handleInputEnd();
    }

    render() {
        const CheckBoxComponent = this.props.component ? this.props.component : Checkbox;

        return super.render(
            <CheckBoxComponent
                {...this.props}
                containerStyle={[
                    styles.checkboxContainerStyle,
                    this.props.globalStyles
                        ? this.props.globalStyles.checkboxContainerStyle
                        : null,
                    this.props.containerStyle,
                ]}
                onChange={this.handleCheckboxChange}
                checkboxStyle={styles.checkboxBoxStyle}
                checked={this.state.value || this.props.checked}
                label={this.props.checkboxLabel}
                labelContainerStyle={[
                    styles.checkboxLabelContainer,
                    this.props.labelContainerStyle,
                ]}
                labelStyle={[
                    styles.checkboxLabel,
                    this.props.labelStyle,
                ]}
                underlayColor={colors.touchableUnderlayColor}
            />
        );
    }
}
