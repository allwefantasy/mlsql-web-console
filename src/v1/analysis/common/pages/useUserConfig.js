import React, { useState, useCallback, useEffect } from 'react';
import { Form, Card, Button } from 'antd';
import AlertBox from '../../../AlertBox';
import { FormattedMessage } from 'react-intl';


function useUserConfig(props) {
    const [error, setError] = useState(undefined)
    const [success, setSuccess] = useState(undefined)
    const [current, setCurrent] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const getParams = () => {
        return form.getFieldsValue()
    }
    const ui = ({ formItems, title, submit }) => (
        <div className="common-margin common-child-center">
            <Card title={title} style={{ width: "50%" }}>
                <Form form={form}>
                    {error && <AlertBox message={<FormattedMessage id={error} />} />}
                    {success && <AlertBox title={<FormattedMessage id="congratulation"/>} type="success" message={<FormattedMessage id={success} />} />}
                    {formItems}
                </Form>
                <Form.Item>
                    <Button type="primary" loading={loading} onClick={
                        submit
                    }><FormattedMessage id="apply" /></Button>
                </Form.Item>
            </Card>
        </div>
    )
    return { ui, form, setError, setLoading, getParams,setCurrent,current,setSuccess}
}
export { useUserConfig }