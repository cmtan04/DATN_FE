import {
  Button,
  Divider,
  Drawer,
  Form,
  Grid,
  Select,
  Slider,
  Space,
  Typography,
} from "antd";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllLocationType,
  type LocationQueryFilter,
} from "../../api/location.api";
import { LOCATION_QUERY_KEYS } from "../../constants/queryKeys";
import "./style.scss";

interface LocationFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  initialFilter: LocationQueryFilter;
  onApply: (filter: LocationQueryFilter) => void;
}

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "createdAt-DESC" },
  { label: "Giá: Thấp đến Cao", value: "price-ASC" },
  { label: "Giá: Cao đến Thấp", value: "price-DESC" },
  { label: "Diện tích: Nhỏ đến Lớn", value: "area-ASC" },
  { label: "Diện tích: Lớn đến Nhỏ", value: "area-DESC" },
  { label: "Đánh giá tốt nhất", value: "averageRating-DESC" },
];

const { useBreakpoint } = Grid;

export const LocationFilterDrawer = ({
  open,
  onClose,
  initialFilter,
  onApply,
}: LocationFilterDrawerProps) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isDesktop = screens.lg;

  const { data: locationTypes } = useQuery({
    queryKey: LOCATION_QUERY_KEYS.types,
    queryFn: getAllLocationType,
  });

  useEffect(() => {
    const sortValue = initialFilter.sortBy
      ? `${initialFilter.sortBy}-${initialFilter.sortOrder || "DESC"}`
      : "createdAt-DESC";

    form.setFieldsValue({
      keyword: initialFilter.searchValue,
      guestCount: initialFilter.guestCount,
      locationTypeId: initialFilter.locationTypeId ?? 0,
      priceRange: [
        initialFilter.minPrice ?? 0,
        initialFilter.maxPrice ?? 20000000,
      ],
      areaRange: [initialFilter.minArea ?? 0, initialFilter.maxArea ?? 200],
      sort: sortValue,
    });
  }, [form, initialFilter]);

  const getFilterFromForm = (): LocationQueryFilter => {
    const values = form.getFieldsValue();
    let sortBy: string | undefined;
    let sortOrder: "ASC" | "DESC" | undefined;

    if (values.sort) {
      const [field, order] = String(values.sort).split("-");
      sortBy = field;
      sortOrder = order as "ASC" | "DESC";
    }

    return {
      searchValue: values.keyword?.trim() || undefined,
      guestCount: values.guestCount,
      locationTypeId:
        values.locationTypeId === 0 ? undefined : values.locationTypeId,
      minPrice: values.priceRange?.[0] > 0 ? values.priceRange[0] : undefined,
      maxPrice:
        values.priceRange?.[1] < 20000000 ? values.priceRange[1] : undefined,
      minArea: values.areaRange?.[0] > 0 ? values.areaRange[0] : undefined,
      maxArea: values.areaRange?.[1] < 200 ? values.areaRange[1] : undefined,
      sortBy,
      sortOrder,
    };
  };

  const handleValuesChange = (changedValues: Record<string, unknown>) => {
    if (!isDesktop) return;
    if ("priceRange" in changedValues || "areaRange" in changedValues) return;
    onApply(getFilterFromForm());
  };

  const handleRangeChangeComplete = () => {
    if (!isDesktop) return;
    onApply(getFilterFromForm());
  };

  const handleApply = () => {
    onApply(getFilterFromForm());
    onClose();
  };

  const handleReset = () => {
    form.resetFields();
    if (isDesktop) {
      onApply(getFilterFromForm());
    }
  };

  const priceRange = Form.useWatch("priceRange", form) ?? [0, 20000000];
  const areaRange = Form.useWatch("areaRange", form) ?? [0, 200];

  const formContent = (
    <Form layout="vertical" form={form} onValuesChange={handleValuesChange}>
      <div className="location-filter__section">
        <Typography.Title level={5}>Sắp xếp theo</Typography.Title>
        <Form.Item name="sort" noStyle>
          <Select placeholder="Chon kieu sap xep" options={SORT_OPTIONS} />
        </Form.Item>
      </div>

      <Divider />

      <div className="location-filter__section">
        <Typography.Title level={5}>Loại hình chỗ ở</Typography.Title>
        <Form.Item name="locationTypeId" noStyle>
          <Select
            placeholder="Chon loai hinh"
            options={locationTypes?.map((type) => ({
              label: type.name,
              value: type.id,
            }))}
          />
        </Form.Item>
      </div>

      <Divider />

      <Form.Item label="Khoang gia (VND)" name="priceRange">
        <Slider
          range
          min={0}
          max={20000000}
          step={500000}
          marks={{ 0: "0", 20000000: "20tr+" }}
          tooltip={{ formatter: (value) => `${value?.toLocaleString()}d` }}
          onChangeComplete={handleRangeChangeComplete}
        />
      </Form.Item>
      <div className="location-filter__range-label">
        {priceRange[0].toLocaleString()}d -{" "}
        {priceRange[1] >= 20000000
          ? "Tren 20.000.000d"
          : `${priceRange[1].toLocaleString()}d`}
      </div>

      <Divider />

      <Form.Item label="Dien tich su dung (m2)" name="areaRange">
        <Slider
          range
          min={0}
          max={200}
          step={5}
          marks={{ 0: "0", 200: "200+" }}
          tooltip={{ formatter: (value) => `${value} m2` }}
          onChangeComplete={handleRangeChangeComplete}
        />
      </Form.Item>
      <div className="location-filter__range-label">
        {areaRange[0]} m2 -{" "}
        {areaRange[1] >= 200 ? "Tren 200 m2" : `${areaRange[1]} m2`}
      </div>
    </Form>
  );

  if (isDesktop) {
    return (
      <aside className="location-filter">
        <div className="location-filter__head">
          <h3>Bo loc tim kiem</h3>
          <Button type="link" onClick={handleReset}>
            Dat lai
          </Button>
        </div>
        {formContent}
      </aside>
    );
  }

  return (
    <Drawer
      title="Bo loc & Sap xep"
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      extra={
        <Space>
          <Button onClick={handleReset}>Xoa bo loc</Button>
          <Button type="primary" onClick={handleApply}>
            Ap dung
          </Button>
        </Space>
      }
    >
      {formContent}
    </Drawer>
  );
};
