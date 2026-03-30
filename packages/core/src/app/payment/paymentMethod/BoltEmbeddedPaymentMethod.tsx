import React, { type FunctionComponent, useCallback, useState } from 'react';

import { type PaymentFormValues } from '@bigcommerce/checkout/payment-integration-api';

import { connectFormik, type ConnectFormikProps } from '../../common/form';

import BoltCustomForm from './BoltCustomForm';
import { type HostedPaymentMethodProps } from './HostedPaymentMethod';
import HostedWidgetPaymentMethod from './HostedWidgetPaymentMethod';

const BoltEmbeddedPaymentMethod: FunctionComponent<HostedPaymentMethodProps & ConnectFormikProps<PaymentFormValues>> = ({
    isInitializing,
    initializePayment,
    deinitializePayment,
    method,
    formik: { setFieldValue }
}) => {
    const [showCreateAccountCheckbox, setShowCreateAccountCheckbox] = useState(false);

    const boltEmbeddedContainerId = 'bolt-embedded';

    const initializeBoltPayment = useCallback(
        (options) =>
            initializePayment({
                ...options,
                bolt: {
                    containerId: boltEmbeddedContainerId,
                    useBigCommerceCheckout: true,
                    onPaymentSelect: (hasBoltAccount: boolean) => {
                        setShowCreateAccountCheckbox(!hasBoltAccount);

                        if (hasBoltAccount) {
                            setFieldValue('shouldCreateAccount', false);
                        }
                    },
                },
            }),
        [initializePayment, boltEmbeddedContainerId],
    );

    const renderCustomPaymentForm = useCallback(
        () => (
            <BoltCustomForm
                containerId={boltEmbeddedContainerId}
                showCreateAccountCheckbox={showCreateAccountCheckbox}
            />
        ),
        [boltEmbeddedContainerId, showCreateAccountCheckbox],
    );

    return (
        <HostedWidgetPaymentMethod
            containerId="boltEmbeddedOneClick"
            deinitializePayment={deinitializePayment}
            initializePayment={initializeBoltPayment}
            isInitializing={isInitializing}
            method={method}
            renderCustomPaymentForm={renderCustomPaymentForm}
            shouldRenderCustomInstrument
        />
    );
};

export default connectFormik(BoltEmbeddedPaymentMethod);
