'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Checkbox } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';

const ShippingCarriersModal = ({
  isOpen,
  onClose,
  onSave,
  token,
  selectedAddress,
  cartItems,
  apiBaseUrl,
  initialCarrier = '',
  initialService = '',
}) => {
  const [loadingCarrier, setLoadingCarrier] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [carriers, setCarriers] = useState([]);
  const [services, setServices] = useState([]);
  const [tempCarrier, setTempCarrier] = useState(initialCarrier);
  const [tempService, setTempService] = useState(initialService);
  const [rateLoading, setRateLoading] = useState(false);
  const [previewCost, setPreviewCost] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchCarriers = async () => {
      setLoadingCarrier(true);
      try {
        const res = await axios.get(`${apiBaseUrl}/order/carrier`, {
          ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
        });
        setCarriers(res.data.carriers?.carriers || res.data.carriers || []);
      } catch {
        ToastService.error('Failed to load carriers.');
      } finally {
        setLoadingCarrier(false);
      }
    };
    fetchCarriers();
  }, [isOpen, token, apiBaseUrl]);

  useEffect(() => {
    if (!tempCarrier) return;
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const res = await axios.get(
          `${apiBaseUrl}/order/carriers/${tempCarrier}/services`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );
        setServices(res.data.services || []);
      } catch {
        ToastService.error('Failed to load services.');
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, [tempCarrier, token, apiBaseUrl]);

  useEffect(() => {
    if (!tempCarrier || !tempService || !selectedAddress?.postcode) return;

    const fetchRate = async () => {
      setRateLoading(true);
      try {
        const products = cartItems.map(item => ({
          name: item.productId?.name,
          quantity: item.quantity,
          weight: parseFloat(item.productId?.weight) || 1,
          dimensions: {
            depth: parseFloat(item.productId?.dimensions?.depth || 0),
            width: parseFloat(item.productId?.dimensions?.width || 0),
            height: parseFloat(item.productId?.dimensions?.height || 0),
          },
        }));

        const res = await axios.post(
          `${apiBaseUrl}/order/orders/get-shipping-rate`,
          {
            carrierCode: tempCarrier,
            serviceCode: tempService,
            fromPostalCode: 'DA16 2PE',
            toPostalCode: selectedAddress.postcode,
            toCountry: selectedAddress.country || 'United States',
            products,
          },
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );

        if (res.data.success && res.data.rates?.length > 0) {
          const rate = res.data.rates[0];
          setPreviewCost((rate.shipmentCost || 0) + (rate.otherCost || 0));
        } else {
          setPreviewCost(null);
        }
      } catch {
        setPreviewCost(null);
      } finally {
        setRateLoading(false);
      }
    };
    fetchRate();
  }, [tempCarrier, tempService, selectedAddress, cartItems, token, apiBaseUrl]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!tempCarrier || !tempService) {
      ToastService.error('Select a carrier and service.');
      return;
    }
    onSave({
      carrierCode: tempCarrier,
      serviceCode: tempService,
      shipmentCost: previewCost ?? 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-md p-6 relative rounded-xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="h4 text-center font-normal mb-4">Shipping carrier</h3>

        {loadingCarrier ? (
          <p className="body-small text-mono-70">Loading carriers…</p>
        ) : (
          <div className="carrier-selection mb-4">
            <h5 className="mb-2 body-small font-medium">Select carrier</h5>
            {carriers.map(carrier => (
              <label
                key={carrier.carrier_id || carrier.carrier_code}
                className="flex items-center gap-2 mb-2 cursor-pointer"
              >
                <Checkbox
                  checked={tempCarrier === carrier.carrier_code}
                  onChange={() => setTempCarrier(carrier.carrier_code)}
                />
                {carrier.friendly_name || carrier.name}
              </label>
            ))}
          </div>
        )}

        {loadingServices ? (
          <p className="body-small text-mono-70">Loading services…</p>
        ) : (
          services.length > 0 && (
            <div className="service-selection mb-4">
              <h5 className="mb-2 body-small font-medium">Select service</h5>
              {services.map(service => (
                <label
                  key={service.code}
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                >
                  <Checkbox
                    checked={tempService === service.code}
                    onChange={() => setTempService(service.code)}
                  />
                  {service.name}
                </label>
              ))}
            </div>
          )
        )}

        {rateLoading && (
          <p className="caption text-mono-70 mb-2">Calculating rate…</p>
        )}
        {previewCost != null && !rateLoading && (
          <p className="body-small text-primary-color-100 mb-4">
            Estimated shipping: £{previewCost.toFixed(2)}
          </p>
        )}

        <Button variant="primary" className="w-full" onClick={handleSave}>
          Save shipping option
        </Button>
      </div>
    </div>
  );
};

export default ShippingCarriersModal;
