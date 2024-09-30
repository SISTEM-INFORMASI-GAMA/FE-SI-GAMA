import { useNavigate, useParams } from 'react-router-dom';
import { useArticleDetail } from '../../hooks/useArticleDetail';
import { Skeleton } from 'antd';
import DokterRec from '../dokter/DokterRec';

function ArticleDetail() {
  const { article_id: id } = useParams();
  const { data: dataDetail, isLoading } = useArticleDetail(id, true);

  const data = dataDetail?.data?.article;
  const date = new Date(data?.createdAt);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  };
  const formattedDate = date.toLocaleDateString('id-ID', options);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const transformHTML = (content) => {
    return content.replaceAll('\r\n', '<br/>');
  };

  return (
    <div className='container-xl margin-top-100'>
      <button
        className='btn btn-outline-secondary back-button mb-5'
        onClick={handleBack}
      >
        <i className='fas fa-arrow-left'></i> Kembali
      </button>
      <div className='main-content'>
        {isLoading && <Skeleton active />}
        {!isLoading && (
          <>
            <button className='btn btn-success rounded-pill mb-3'>
              {data?.category}
            </button>
            <h1 className='mb-4 fw-bold'>{data?.title}</h1>
            <p className='fs-6 text-body-secondary fw-light'>{formattedDate}</p>
            <p>{data?.description}</p>
            <img
              src={data?.image}
              alt={data?.title}
              className='img-fluid mb-5'
              style={{
                width: '100%',
              }}
            />
            {/* <p>{data?.content}</p> */}
            <div
              dangerouslySetInnerHTML={{ __html: transformHTML(data?.content) }}
            />
            <DokterRec articleCategory={data?.category} />
          </>
        )}
      </div>
    </div>
  );
}

export default ArticleDetail;
