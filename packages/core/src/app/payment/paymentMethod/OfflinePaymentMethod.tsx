import {
    type CheckoutSelectors,
    type PaymentInitializeOptions,
    type PaymentMethod,
    type PaymentRequestOptions,
} from '@bigcommerce/checkout-sdk';
import { noop } from 'lodash';
import { Component, type ReactNode } from 'react';

export interface OfflinePaymentMethodProps {
    method: PaymentMethod;
    deinitializePayment(options: PaymentRequestOptions): Promise<CheckoutSelectors>;
    initializePayment(options: PaymentInitializeOptions): Promise<CheckoutSelectors>;
    onUnhandledError?(error: Error): void;
}

export default class OfflinePaymentMethod extends Component<OfflinePaymentMethodProps> {
    async componentDidMount(): Promise<void> {
        const { initializePayment, method, onUnhandledError = noop } = this.props;

        try {
            await initializePayment({
                gatewayId: method.gateway,
                methodId: method.id,
            });
        } catch (error) {
            onUnhandledError(error);
        }
    }

    async componentWillUnmount(): Promise<void> {
        const { deinitializePayment, method, onUnhandledError = noop } = this.props;

        try {
            await deinitializePayment({
                gatewayId: method.gateway,
                methodId: method.id,
            });
        } catch (error) {
            onUnhandledError(error);
        }
    }

    render(): ReactNode {
        return null;
    }
}
