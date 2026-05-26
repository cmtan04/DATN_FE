import { Col, Row } from "antd";
import "./footer.scss";

const footerColumns = [
  {
    title: "Khám phá",
    links: ["Trang chủ", "Danh sách phòng", "Bản đồ", "Cho thuê phòng"],
  },
  {
    title: "Khu vực",
    links: ["Miền Bắc", "Miền Trung", "Miền Nam", "Khu vực mới"],
  },
  {
    title: "Hỗ trợ",
    links: ["Trung tâm hỗ trợ", "Hướng dẫn sử dụng", "Điều khoản", "Bảo mật"],
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <Row gutter={[24, 24]} className="footer__main">
        <Col xs={24} lg={8} className="footer__brand">
          <div className="footer__logo" aria-label="Hostings">
            <span className="footer__logo-mark">H</span>
            <span className="footer__logo-text">Hostings</span>
          </div>
          <p className="footer__tagline">
            Nền tảng hỗ trợ tìm kiếm không gian thuê nhanh, rõ thông tin và phù
            hợp với nhu cầu sinh hoạt tại Việt Nam.
          </p>
        </Col>

        <Col xs={24} lg={16}>
          <Row gutter={[20, 20]} className="footer__nav">
            {footerColumns.map((column) => (
              <Col xs={24} sm={8} key={column.title} className="footer__col">
                <h3 className="footer__col-title">{column.title}</h3>
                <ul className="footer__col-list">
                  {column.links.map((label) => (
                    <li key={label} className="footer__col-item">
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <div className="footer__bottom">
        <span>© {currentYear} Hostings. All rights reserved.</span>
        <span>Footer tạm thời không điều hướng.</span>
      </div>
    </footer>
  );
};

