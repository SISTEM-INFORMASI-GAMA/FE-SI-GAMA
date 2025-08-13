import { Fragment, useState } from 'react';
import { Button, Divider, Image, Skeleton } from 'antd';
import './DetailPegawai.css';
import { usePegawaiDetail } from '../../../../hooks/kepegawaian/pegawai/usePegawaiDetail';
import moment from 'moment';
import { useDokumenPagination } from '../../../../hooks/kepegawaian/dokumen/useDokumenPagination';
import { FilePdfOutlined } from '@ant-design/icons';
import AddDocument from './addDocument/AddDocument';
const format = 'YYYY-MM-DD';
import Cookies from 'js-cookie';

function ProfilePegawai() {
  const user = Cookies.get('user') && JSON.parse(Cookies.get('user'));
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [dataTable] = useState({
    current_page: 1,
    per_page: 1000,
    total: 0,
  });
  const {
    data: dataDokument,
    isLoading,
    isFetching,
    refetch,
  } = useDokumenPagination(dataTable, user?.pegawaiId);

  const onCancel = () => {
    setShowAddDocument(false);
  };

  const onCreate = () => {
    setShowAddDocument(false);
    refetch();
  };

  // get pegawai detail
  const { data: dataDetail, isLoading: skeleton } = usePegawaiDetail(
    user?.pegawaiId,
    true
  );
  const data = dataDetail?.data;

  const profileData = [
    { label: 'Nama', value: data?.nama },
    { label: 'NIP', value: data?.nip },
    { label: 'Jenis Kelamin', value: data?.jenis_kelamin },
    { label: 'Jabatan', value: data?.jabatan },
    { label: 'Tanggal Lahir', value: moment(data?.tgl_lahir).format(format) },
    { label: 'Nomor Telepon', value: data?.nomor_telepon },
    { label: 'Alamat', value: data?.alamat },
  ];

  return (
    <>
      {skeleton && <Skeleton active />}
      {!skeleton && data && (
        <Fragment key={data.id}>
          <Divider orientation="left">Profil {data?.nama}</Divider>
          <div className="pegawai-profile-container">
            <table className="profile-pegawai__table">
              <tbody>
                {profileData.map((item, index) => (
                  <tr key={index}>
                    <th>{item.label}</th>
                    <td>: {item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="profile-image-container">
              <Image
                width={200}
                height={300}
                src={data?.foto}
                alt={data?.nama}
              />
            </div>
          </div>
          <Divider
            style={{
              margin: '20px 0',
              backgroundColor: '#ccc',
              color: '#ccc',
            }}
          />
          <div className="table-header">
            <h1>Dokumen pegawai</h1>
          </div>
          <div className="dokumen-container">
            {isLoading || isFetching ? (
              <Skeleton active />
            ) : (
              dataDokument?.data?.map((item) => (
                <div key={item.id} className="dokumen-item">
                  <FilePdfOutlined style={{ fontSize: '80px', color: 'red' }} />
                  <p>{item.nama_file}</p>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => window.open(item.file, '_blank')}
                  >
                    Download
                  </Button>
                </div>
              ))
            )}
          </div>
          <AddDocument
            show={showAddDocument}
            onCancel={onCancel}
            onCreate={onCreate}
            id={user?.pegawaiId}
          />
        </Fragment>
      )}
    </>
  );
}

export default ProfilePegawai;
