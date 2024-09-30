import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const renderDate = (dateData) => {
  const date = new Date(dateData);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  };
  const formattedDate = date.toLocaleDateString('id-ID', options);
  return formattedDate;
};

function ArticleCard({ article }) {
  return (
    <div className='col-sm-6 col-md-4 col-lg-3'>
      <div
        className='card'
        style={{
          height: '100%',
        }}
      >
        <img
          src={article.image}
          className='card-img-top card-img-article'
          alt={article.title}
          loading='lazy'
        />
        <div className='card-body'>
          <h3 className='card-title text-clamp'>{article.title}</h3>
          <p className='card-text text-clamp'>{article.content}</p>
          <p className='card-text article-gray-text'>{article.category}</p>
          <p className='card-text article-gray-text'>
            {renderDate(article.createdAt)}
          </p>
          <Link
            to={`/article/${article._id}`}
            className='text-decoration-none fw-medium'
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}

ArticleCard.propTypes = {
  article: propTypes.object.isRequired,
};

export default ArticleCard;
