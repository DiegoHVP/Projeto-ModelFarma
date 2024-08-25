
import Link from "next/link";

export default function CardGallery({ title, description, link }: any) {
  return (
    <div className="col-sm-6">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <Link href={link} className="btn btn-primary">
            Ver mais
          </Link>
        </div>
      </div>
    </div>
  );
}
