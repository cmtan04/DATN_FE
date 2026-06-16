import { Col, Row } from "antd";
import { useLottie } from "lottie-react";
import call from "@shared/assets/lottie/call.json";
import docs from "@shared/assets/lottie/docs.json";
import find from "@shared/assets/lottie/find.json";
import search from "@shared/assets/lottie/search.json";
import "./styles.scss";

type SupportStep = {
  id: number;
  title: string;
  description: string;
  animationData: unknown;
};

const supportSteps: SupportStep[] = [
  {
    id: 1,
    title: "Tìm kiếm dễ dàng",
    description:
      "Khám phá không gian sống lý tưởng theo nhu cầu riêng của bạn bằng bộ lọc thông minh hoặc bản đồ định vị.",
    animationData: search,
  },
  {
    id: 2,
    title: "Đặt phòng nhanh chóng",
    description:
      "Quy trình đặt phòng đơn giản, rõ ràng, kết nối trực tiếp với chủ nhà chỉ trong vài thao tác.",
    animationData: docs,
  },
  {
    id: 3,
    title: "Tận tình hỗ trợ",
    description:
      "Đội ngũ chuyên viên luôn sát cánh để hỗ trợ và giải đáp các thắc mắc của bạn một cách nhanh chóng.",
    animationData: call,
  },
  {
    id: 4,
    title: "An tâm lưu trú",
    description:
      "Đồng hành để xử lý các vấn đề phát sinh trong quá trình lưu trú, đảm bảo trải nghiệm của bạn.",
    animationData: find,
  },
];

type SupportLottieIconProps = {
  animationData: unknown;
};

function SupportLottieIcon({ animationData }: SupportLottieIconProps) {
  const { View } = useLottie(
    {
      animationData,
      autoplay: true,
      loop: true,
    },
    {
      width: "100%",
      aspectRatio: "1",
      // width: 96,
      //height: 96,
    },
  );

  return <div className="section__lottie">{View}</div>;
}

export function Support() {
  return (
    <section className="section">
      <div className="section__shell">
        <div className="section__header">
          <p className="section__title">Hostings</p>
          <h2>Cung cấp trải nghiệm lưu trú bạn mong muốn</h2>
        </div>

        <Row
          gutter={[
            { xs: 16, sm: 16, md: 20, lg: 24 },
            { xs: 16, sm: 16, md: 20, lg: 24 },
          ]}
          className="section__grid"
        >
          {supportSteps.map((step) => (
            <Col xs={24} sm={12} lg={6} key={step.id}>
              <article className="section__card">
                <div className="section__icon-wrap">
                  <SupportLottieIcon animationData={step.animationData} />
                </div>
                <div className="section__card-body">
                  <h3 className="section__card-title">{step.title}</h3>
                  <p className="section__card-description">
                    {step.description}
                  </p>
                </div>
              </article>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
