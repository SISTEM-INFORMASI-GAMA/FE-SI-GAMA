import { Drawer, Form, InputNumber, Select, Button, message, Divider, Tag } from 'antd';
import { useEffect } from 'react';
import { useTermOptions } from '../../../../hooks/akademik/term/useTermOptions';
import { useGradingPolicy, useUpsertGradingPolicy } from '../../../../hooks/akademik/policy/useGradingPolicy';
import propTypes from 'prop-types';


const DEFAULT_TYPES = ['task','quiz','uts','uas'];

const PolicyDrawer = ({ open, onClose, classSubjectId }) => {
  const [form] = Form.useForm();
  const { data: termResp, isLoading: loadingTerms } = useTermOptions();

  const termOptions = (termResp?.data || termResp?.rows || []).map((t) => ({
    label: t.name || t.yearLabel || t.year || t.id,
    value: t.id,
  }));

  // ⚠️ Pindahkan SEMUA watch ke top-level (tanpa kondisi)
  const termId = Form.useWatch('termId', form);
  const weightsWatch = Form.useWatch('weights', form);
  const kkmWatch = Form.useWatch('kkm', form);

  const { data: policyResp, isError, isFetching } =
    useGradingPolicy(classSubjectId, termId, open && !!termId);
  const upsertMut = useUpsertGradingPolicy(classSubjectId);

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  useEffect(() => {
    if (!open) return;

    if (!termId) {
      form.setFieldsValue({
        weights: DEFAULT_TYPES.map((k) => ({ type: k, weight: 0 })),
        kkm: 75,
      });
      return;
    }

    if (policyResp?.data) {
      const p = policyResp.data;
      const weights = DEFAULT_TYPES.map((k) => ({
        type: k,
        weight: Number(p.policyJson?.[k] ?? 0),
      }));
      form.setFieldsValue({ kkm: p.kkm ?? 75, weights });
    } else if (isError) {
      form.setFieldsValue({
        kkm: 75,
        weights: DEFAULT_TYPES.map((k) => ({ type: k, weight: 0 })),
      });
    }
  }, [open, termId, policyResp, isError, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const weightsObj = {};
      let total = 0;
      (values.weights || []).forEach((w) => {
        const val = Number(w.weight || 0);
        weightsObj[w.type] = val;
        total += val;
      });
      if (total !== 100) {
        message.error('Total bobot harus 100.');
        return;
      }
      await upsertMut.mutateAsync({
        termId: values.termId,
        policyJson: weightsObj,
        kkm: Number(values.kkm) || 75,
      });
      message.success('Grading policy disimpan.');
      onClose(true);
    } catch (e) {
      message.error(e?.response?.data?.message || e.message);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={() => onClose(false)}
      title="Grading Policy"
      width={520}
      destroyOnClose
      extra={
        <Button type="primary" onClick={handleSave} loading={upsertMut.isLoading}>
          Simpan
        </Button>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="termId"
          label="Term"
          rules={[{ required: true, message: 'Pilih term' }]}
        >
          <Select
            options={termOptions}
            loading={loadingTerms}
            showSearch
            placeholder="Pilih term"
            filterOption={(input, opt) =>
              (opt?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item name="kkm" label="KKM" rules={[{ required: true }]}>
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.List
          name="weights"
          rules={[
            {
              validator: async (_, arr) => {
                if (!arr || !arr.length)
                  return Promise.reject(new Error('Minimal satu komponen.'));
              },
            },
          ]}
        >
          {(fields) => (
            <>
              {fields.map(({ key, name, ...rest }) => (
                <div
                  key={key}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 140px',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <Form.Item {...rest} name={[name, 'type']} rules={[{ required: true }]}>
                    <Select
                      options={DEFAULT_TYPES.map((t) => ({ label: t.toUpperCase(), value: t }))}
                      showSearch
                      placeholder="type"
                    />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'weight']} rules={[{ required: true }]}>
                    <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="%" />
                  </Form.Item>
                </div>
              ))}
            </>
          )}
        </Form.List>

        {/* ✅ gunakan nilai hasil watch (sudah di-top-level), bukan panggil hook di sini */}
        {!isFetching && (
          <>
            <Divider />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(weightsWatch || []).map((w, i) => (
                <Tag key={i}>{`${w?.type ?? ''}: ${w?.weight ?? 0}%`}</Tag>
              ))}
              <Tag color="cyan">KKM: {kkmWatch ?? 75}</Tag>
            </div>
          </>
        )}
      </Form>
    </Drawer>
  );
};

PolicyDrawer.propTypes = {
  open: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  classSubjectId: propTypes.string.isRequired,
};

export default PolicyDrawer;
