import React from 'react';
import Slider from 'react-native-multi-slider';
import {
    StyleSheet,
} from 'react-native';

import Input from '../Input';
import colors from '../colors';
import { formRangeInputType } from './types';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 30,
        alignSelf: 'center',
    },
    track: {
        borderRadius: 7,
        height: 3.5,
    },
    selected: {
        backgroundColor: 'red',
    },
    unselected: {
        backgroundColor: colors.lightGrey,
    },
    marker: {
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: colors.white,
        borderWidth: 0.5,
        borderColor: colors.lighterGrey,
    },
    pressedMarkerStyle: {
        backgroundColor: colors.lighterGrey,
    },
});

export default class FormRangeInput extends Input {
    static type = formRangeInputType;

    static propTypes = {
        ...Slider.propTypes,
        ...Input.propTypes,
        initialValues: Slider.propTypes.values,
        type: React.PropTypes.oneOf([FormRangeInput.type]),
    };

    static defaultProps = {
        customize: {},
    };

    handleRangeChange = (value) => {
        this.handleChange(value);
        this.handleInputEnd();
    };

    render() {
        return super.render(
            <Slider
                {...this.props}
                containerStyle={[
                    styles.container,
                    this.props.customize.FormRangeInputContainerStyle,
                    this.props.containerStyle,
                ]}
                trackStyle={[
                    styles.track,
                    this.props.customize.FormRangeInputTrackStyle,
                    this.props.trackStyle,
                ]}
                selectedStyle={[
                    styles.selected,
                    this.props.customize.FormRangeInputSelectedStyle,
                    this.props.selectedStyle,
                ]}
                unselectedStyle={[
                    styles.unselected,
                    this.props.customize.FormRangeInputUnselectedStyle,
                    this.props.unselectedStyle,
                ]}
                markerStyle={[
                    styles.marker,
                    this.props.customize.FormRangeInputMarkerStyle,
                    this.props.markerStyle,
                ]}
                pressedMarkerStyle={[
                    styles.pressedMarker,
                    this.props.customize.FormRangeInputPressedMarkerStyle,
                    this.props.pressedMarkerStyle,
                ]}
                values={this.props.initialValues || this.props.values}
                onValuesChangeFinish={this.handleRangeChange}
                ref={this.handleRef}
            />
        );
    }
}
