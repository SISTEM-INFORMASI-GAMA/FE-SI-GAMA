import { Button, DatePicker, Input, Space, Table, Tooltip } from 'antd';
import { useState } from 'react';
import moment from 'moment';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { SearchOutlined } from '@ant-design/icons';
import { usePresensiRecap } from '../../../../hooks/kepegawaian/presensi/usePresensiRecap';

export const RekapPresensi = () => {
  const firstDate = new Date();
  const lastDate = new Date();
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });
  const [keyword, setKeyword] = useState('');
  const [date, setDate] = useState({
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
  });

  const { data, isLoading, isFetching } = usePresensiRecap(
    dataTable,
    keyword,
    date
  );

  const dataToExport = data?.data?.map((x, i) => {
    return {
      No: i + 1,
      Nama: x.nama,
      NIP: x.nip,
      'Pegawai Hadir': x.hadir,
      'Pegawai Izin': x.izin,
      'Pegawai Sakit': x.sakit,
      'Pegawai Alpa': x.alpa,
      'Akumulasi Kehadiran Pegawai': `${x.akumulasi} %`,
    };
  });

  const handleExport = () => {
    const headerFile = [
      ['SMA Gajah Mada Bandar Lampung'],
      [`Data Rekapitulasi Absensi Pegawai Tanggal ${date.from} - ${date.to}`],
    ];

    const tableHeaders = [
      [
        'No',
        'Nama',
        'NIP',
        'Pegawai Hadir',
        'Pegawai Izin',
        'Pegawai Sakit',
        'Pegawai Alpa',
        'Akumulasi Kehadiran Pegawai',
      ],
    ];
    const tableData = dataToExport.map((item) => Object.values(item));

    const wsData = [...headerFile, [], ...tableHeaders, ...tableData];

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(wsData);

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Merge for "SMA Gajah Mada Bandar Lampung" (A1 to H1)
      { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // Merge for "Data Rekapitulasi Absensi Pegawai..." (A3 to H3)
    ];

    ws['!cols'] = [
      { wpx: 40 }, // No
      { wpx: 180 }, // Nama
      { wpx: 150 }, // NIP
      { wpx: 120 }, // Pegawai Hadir
      { wpx: 120 }, // Pegawai Izin
      { wpx: 120 }, // Pegawai Sakit
      { wpx: 120 }, // Pegawai Alpa
      { wpx: 180 }, // Akumulasi Kehadiran Pegawai
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Data Rekapitulasi Absensi');
    XLSX.writeFile(wb, `data_recap_absensi.xlsx`);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      align: 'left',
      width: window.innerWidth > 800 ? 70 : 50,
    },
    {
      title: 'Nama',
      dataIndex: 'nama',
      align: 'left',
      width: window.innerWidth > 800 ? 200 : 130,
    },
    {
      title: 'NIP',
      dataIndex: 'nip',
      align: 'left',
      width: window.innerWidth > 800 ? 200 : 150,
    },
    {
      title: 'Hadir',
      dataIndex: 'hadir',
      align: 'left',
    },
    {
      title: 'Izin',
      dataIndex: 'izin',
      align: 'left',
    },
    {
      title: 'Sakit',
      dataIndex: 'sakit',
      align: 'left',
    },
    {
      title: 'Alpa',
      dataIndex: 'alpa',
      align: 'left',
    },

    {
      title: 'Akumulasi Kehadiran',
      dataIndex: 'akumulasi',
      align: 'center',
      width: window.innerWidth > 800 ? 200 : 200,
      render: (akumulasi) => {
        return (
          <>
            <h6>{akumulasi}%</h6>
          </>
        );
      },
    },
  ];

  const dataSource = data?.data
    ?.sort((a, b) => a.nama.localeCompare(b.nama))
    .slice(0, dataTable.per_page)
    .map((x, i) => {
      return {
        ...x,
        key: x._id,
        index: i + 1,
      };
    });

  const pagination = {
    current: dataTable.current_page,
    pageSize: dataTable.per_page,
    total: data?.data?.total,
    showSizeChanger: true,
    pageSizeOptions: [15, 20, 50, 100],
    onChange: (curr, size) => {
      setDataTable((prev) => {
        return {
          ...prev,
          current_page: curr,
          per_page: size,
        };
      });
    },
  };

  return (
    <>
      <div className="table-header">
        <h1>Rekap Presensi Pegawai</h1>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              handleExport();
            }}
          >
            Export Excel
          </Button>
        </Space>
      </div>
      <div className="presensi-filter">
        <Input
          allowClear
          value={keyword}
          placeholder="cari nama..."
          prefix={<SearchOutlined />}
          onChange={({ target: { value } }) => setKeyword(value)}
          className="item-search"
        />
        <Tooltip Tooltip title="tanggal awal">
          <DatePicker
            value={dayjs(date.from)}
            onChange={(value) => {
              setDate((curr) => ({
                ...curr,
                from:
                  value !== null
                    ? value.format('YYYY-MM-DD')
                    : moment(firstDate).format('YYYY-MM-DD'),
              }));
            }}
            placeholder="Awal"
          />
        </Tooltip>
        <Tooltip Tooltip title="tanggal akhir">
          <DatePicker
            value={dayjs(date.to)}
            onChange={(value) =>
              setDate((curr) => ({
                ...curr,
                to:
                  value !== null
                    ? value.format('YYYY-MM-DD')
                    : moment(lastDate).format('YYYY-MM-DD'),
              }))
            }
            placeholder="Akhir"
          />
        </Tooltip>
      </div>
      <Table
        size="small"
        tableLayout="auto"
        columns={columns}
        loading={isLoading || isFetching}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{
          y: '50vh',
          x: 800,
        }}
      />
    </>
  );
};
