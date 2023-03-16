import { React, useEffect, useState } from 'react';
import UserLayout from '../../../layouts/UserLayout';
import { Col, Row, Pagination, Card, Button } from 'antd';
import { useLocation } from 'react-router-dom';
import ProductServices from '../../../apis/productServices';
import { CheckCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import PATH from '../../../commons/path';
import './home.css'
import CategoryServices from '../../../apis/categoryServices';
const { Meta } = Card;

const Home = () => {
    const location = useLocation();
    const [products, setProducts] = useState();
    const [inCartItems, setInCartItems] = useState(0);

    const getAllProducts = async (search, page, pageSize) => {
        const categories = await CategoryServices.getAllCategories();
        const pathName = location.pathname.replace("/", "");
        let categoryId = "";
        if (categories.status === 200) {
            categoryId = categories.data.results.find(c => c.url === pathName)?.id;
        }
        if (categoryId) {
            const res = await ProductServices.getAllProductsByCategory(categoryId, search, page, pageSize);
            if (res.status === 200) {
                setProducts(res.data.result);
            }
        } else {
            const res = await ProductServices.getAllProducts(search, page, pageSize);
            if (res.status === 200) {
                setProducts(res.data.result);
            }
        }
    }

    useEffect(() => {
        getAllProducts();
        const itemsInCart = localStorage.getItem("inCartItems");
        if(itemsInCart) {
            const jsonParsed = JSON.parse(itemsInCart);
            setInCartItems(jsonParsed.length);
        }
    }, [location.pathname]);

    const numberFormater = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }

    const onChange = async (pageNumber, pageSize) => {
        await getAllProducts("", pageNumber, pageSize);
    };

    const onAddToCart = (item) => {
        const itemsInCart = localStorage.getItem("inCartItems");
        if(itemsInCart && itemsInCart.length) {
            try {
                const jsonParsed = JSON.parse(itemsInCart);
                jsonParsed.push(item.id);
                localStorage.setItem("inCartItems", JSON.stringify(jsonParsed));
            } catch (ignored) {
                localStorage.removeItem("inCartItems");
                localStorage.setItem("inCartItems", JSON.stringify([item.id]));
            }
            
        } else {
            localStorage.setItem("inCartItems", JSON.stringify([item.id]));
        }
        setInCartItems(inCartItems+1);
    }

    const onCheckItemInCart = (item) => {
        const itemsInCart = localStorage.getItem("inCartItems");
        if(itemsInCart) {
            try {
                const jsonParsed = JSON.parse(itemsInCart);
                const itm = jsonParsed.find(i => i === item.id);
                return itm ? true : false;
            } catch (ignored) {
                return false;
            }
        } else {
            return false
        }
    }

    return (
        <UserLayout inCartItems={inCartItems}>
            <div style={{ width: "100%", height: "100%", padding:"16px"}}>
                <Row wrap gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                    {products?.results.map(product => (
                        <Col
                            key={product.id}
                            className="gutter-row"
                            xs={{
                                span: 24,
                                offset: 0,
                            }}
                            sm={{
                                span: 12,
                                offset: 0
                            }}
                            md={{
                                span: 8,
                                offset: 0
                            }}
                            lg={{
                                span: 8,
                                offset: 0
                            }}
                            xl={{
                                span: 6,
                                offset: 0
                            }}
                            xxl={{
                                span: 4,
                                offset: 0
                            }}>
                            <Card
                                cover={
                                    <div className='image-component'>
                                        <img
                                            alt={product.productName}
                                            src={product.imageURLs && product.imageURLs.length ? product.imageURLs.find(i => i.isMainImage).url.includes("http") ?
                                                product.imageURLs.find(i => i.isMainImage).url :
                                                `${PATH.IMAGEBASEURL}${product.imageURLs.find(i => i.isMainImage).url}`
                                                : ""}
                                        />
                                    </div>
                                }
                                bordered={false}
                                actions={[
                                    <Button danger type="link"  icon={<CheckCircleOutlined />}>Buy</Button>,
                                    <Button type="link" onClick={() => onAddToCart(product)} disabled={onCheckItemInCart(product)} icon={<ShoppingCartOutlined />}>{onCheckItemInCart(product) ? "Added to cart" : "Add to cart"}</Button>
                                ]}
                                style={{
                                    height: "540px"
                                }}
                            >
                                <Meta
                                    title={product.productName}
                                    description={(
                                        <>
                                            <p>{numberFormater(product.price)}</p>
                                            <span className='product-description-conponent'>{product.description}</span>
                                        </>
                                    )}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
                <br />
                <div style={{
                    textAlign: "right"
                }}>
                    <Pagination showQuickJumper current={products?.currentPage} total={products?.totalRecords} onChange={onChange} pageSize={products? products.pageSize : 24} pageSizeOptions={["6", "12", "24", "48", "96"]} defaultPageSize={"24"}/>
                </div>
                
            </div>
        </UserLayout>
    );
}

export default Home;