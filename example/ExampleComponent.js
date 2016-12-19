import React, { Component } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native';

import Form from 'react-native-osd-form';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingTop: 0,
    },
    title: {
        fontSize: 20,
    },
    error: { color: '#FFFFFF' },
    errorContainer: {
        backgroundColor: '#000077',
        marginTop: 2,
    },
    inputError: { borderColor: '#000077' },
});

export default class Example extends Component {

    validateEmail = (email = '') => {
        const re = /^([\w-\+]+(?:\.[\w-\+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        return re.test(email);
    }

    validatePassword = (password = '') => {
        return (password && password.length >= 8);
    }

    handleSubmit = (formValues) => {
        console.log(formValues);
    }

    render() {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
            >
                <Text style={styles.title}>{'Input types'}</Text>
                <Form
                    onSubmit={this.handleSubmit}
                    formGroups={[
                        {
                            label: 'Text like inputs',
                            inputs: [
                                {
                                    type: 'email',
                                    name: 'email',
                                    label: 'Email',
                                },
                                {
                                    type: 'password',
                                    name: 'password',
                                    label: 'Password',
                                },
                                {
                                    type: 'textarea',
                                    name: 'description',
                                    label: 'Description',
                                },
                            ],
                        },
                        {
                            label: 'Checkboxes',
                            inputs: [
                                {
                                    type: 'checkbox',
                                    name: 'checkbox',
                                    checkboxLabel: 'I accept the terms and conditions',
                                    label: 'Terms and Conditions',
                                },
                                {
                                    type: 'checkboxes',
                                    name: 'checkboxes',
                                    label: 'Choose some stuff',
                                    options: [
                                        {
                                            label: 'Item 1',
                                            value: 'item-1',
                                        },
                                        {
                                            label: 'Item 2',
                                            value: 'item-2',
                                        },
                                        {
                                            label: 'Item 3',
                                            value: 'item-3',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            label: 'Media inputs',
                            inputs: [
                                {
                                    type: 'image',
                                    name: 'Image',
                                    label: 'Select a profile picture',
                                },
                            ],
                        },
                        {
                            label: 'Checkboxes',
                            inputs: [
                                {
                                    type: 'checkbox',
                                    name: 'checkbox',
                                    checkboxLabel: 'I accept the terms and conditions',
                                    label: 'Terms and Conditions',
                                },
                                {
                                    type: 'checkboxes',
                                    name: 'checkboxes',
                                    label: 'Choose some stuff',
                                    options: [
                                        {
                                            label: 'Item 1',
                                            value: 'item-1',
                                        },
                                        {
                                            label: 'Item 2',
                                            value: 'item-2',
                                        },
                                        {
                                            label: 'Item 3',
                                            value: 'item-3',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            label: 'Time related inputs',
                            inputs: [
                                {
                                    type: 'datetime',
                                    name: 'datetime',
                                    label: 'What date and time is it?',
                                },
                                {
                                    type: 'date',
                                    name: 'date',
                                    label: 'What date is it?',
                                },
                                {
                                    type: 'time',
                                    name: 'time',
                                    label: 'What time is it?',
                                },
                            ],
                        },
                        {
                            label: 'Choice inputs',
                            inputs: [
                                {
                                    type: 'pills',
                                    name: 'pills',
                                    label: 'Select a Pill',
                                    initialValue: 'red',
                                    options: [
                                        {
                                            label: 'Blue Pill',
                                            value: 'blue',
                                            selectedContainerStyle: {
                                                borderBottomColor: 'blue',
                                            },
                                            selectedStyle: {
                                                color: 'blue',
                                            },
                                        },
                                        {
                                            label: 'Red Pill',
                                            value: 'red',
                                            selectedContainerStyle: {
                                                borderBottomColor: 'red',
                                            },
                                            selectedStyle: {
                                                color: 'red',
                                            },
                                        },
                                    ],
                                },
                                {
                                    type: 'radio',
                                    name: 'radioInModal',
                                    asModal: true,
                                    initialValue: 'musk',
                                    label: 'Choose the Tech star you prefer in the whole world (in a modal)',
                                    modalButtonLabel: 'Preferred Tech star:',
                                    options: [
                                        {
                                            label: 'Ellon Musk',
                                            value: 'musk',
                                        },
                                        {
                                            label: 'Jeff Bezos',
                                            value: 'besoz',
                                        },
                                        {
                                            label: 'Mark Zuckerberg',
                                            value: 'zuckerberg',
                                        },
                                    ],
                                },
                                {
                                    type: 'radio',
                                    name: 'radio',
                                    asModal: false,
                                    initialValue: 'pirate',
                                    label: 'Choose a Radio',
                                    options: [
                                        {
                                            label: 'Virgin Radio',
                                            value: 'virgin',
                                        },
                                        {
                                            label: 'Pirate Radio',
                                            value: 'pirate',
                                        },
                                        {
                                            label: 'Quebec Radio',
                                            value: 'quebec',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            label: 'Other',
                            inputs: [
                                {
                                    type: 'range',
                                    name: 'range',
                                    label: 'Choose a value in a range',
                                    initialValues: [10, 200],
                                    min: 10,
                                    max: 200,
                                    step: 5,
                                },
                                {
                                    type: 'switch',
                                    name: 'switch',
                                    label: 'On or off?',
                                },
                            ],
                        },
                        {
                            label: 'Buttons',
                            inputs: [
                                {
                                    type: 'button',
                                    text: 'Do something',
                                    onPress: () => Alert.alert(
                                        'Doing something',
                                        'Is this doing something alright?',
                                        [
                                            {
                                                text: 'No',
                                                onPress: () => console.log('No pressed'),
                                            },
                                            {
                                                text: 'Cancel',
                                                onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'Yes',
                                                onPress: () => console.log('Yes Pressed'),
                                            },
                                        ]
                                    ),
                                },
                                {
                                    type: 'submit',
                                    text: 'Send',
                                },
                            ],
                        },
                    ]}
                />
                <Text style={styles.title}>{'Validation with default errors'}</Text>
                <Form
                    inputs={[
                        {
                            type: 'email',
                            name: 'email',
                            label: 'Email',
                            validationFunctions: [
                                this.validateEmail,
                            ],
                            validationErrorMessages: [
                                'Email is not valid',
                            ],
                        },
                        { type: 'separator' },
                        {
                            type: 'password',
                            name: 'password',
                            label: 'Password',
                            validationFunctions: [
                                this.validatePassword,
                            ],
                            validationErrorMessages: [
                                'Password is not valid, it should have at least 8 characters',
                            ],
                        },
                        { type: 'separator' },
                        {
                            type: 'submit',
                            text: 'Send',
                        },
                    ]}
                />
                <Text style={styles.title}>{'Validation with customized errors'}</Text>
                <Form
                    customize={{
                        inputErrorStyle: styles.error,
                        inputErrorContainerStyle: styles.errorContainer,
                        inputContainerErrorStyle: styles.inputError,
                    }}
                    inputs={[
                        {
                            type: 'email',
                            name: 'email',
                            label: 'Email',
                            validationFunctions: [
                                this.validateEmail,
                            ],
                            validationErrorMessages: [
                                'Email is not valid',
                            ],
                        },
                        {
                            type: 'password',
                            name: 'password',
                            label: 'Password',
                            validationFunctions: [
                                this.validatePassword,
                            ],
                            validationErrorMessages: [
                                'Password is not valid, it should have at least 8 characters',
                            ],
                        },
                        {
                            type: 'submit',
                            text: 'Send',
                        },
                    ]}
                />
                <Text style={styles.title}>{'Validation with "Global error display"'}</Text>
                <Form
                    displayErrorsGlobally
                    customize={{

                    }}
                    formGroups={[
                        {
                            inputs: [
                                {
                                    type: 'email',
                                    name: 'email',
                                    label: 'Email',
                                    validationFunctions: [
                                        this.validateEmail,
                                    ],
                                    validationErrorMessages: [
                                        'Email is not valid',
                                    ],
                                },
                                {
                                    type: 'password',
                                    name: 'password',
                                    label: 'Password',
                                    validationFunctions: [
                                        this.validatePassword,
                                    ],
                                    validationErrorMessages: [
                                        'Password is not valid, it should have at least 8 characters',
                                    ],
                                },
                            ],
                        },
                        {
                            inputs: [
                                {
                                    type: 'submit',
                                    text: 'Send',
                                },
                            ],
                        },
                    ]}
                />
            </ScrollView>
        );
    }
}
