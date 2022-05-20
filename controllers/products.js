const product = require('../models/product')
const getAllproductsStatic = async (req, res) => {
    const search = 'a'
    const products = await product.find({ price: { $gt: 30 } }).sort('price').select('name price').limit(10).skip(5)
    res.status(200).json({
        products, nHits: products.length
    })
}

const getAllproducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    const queryObject = {};
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }
    if(numericFilters){
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regex = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regex, (match) => `-${operatorMap[match]}-`);
        const options = [ 'price', 'rating'];
        console.log(filters)
        filters = filters.split(',').forEach(element => {
            console.log(filters.split(','))
            console.log(element)
            console.log(element.split('-'))
                const [field, operator, value] = element.split('-');
                console.log(field)
                if(options.includes(field.trim())){
                    queryObject[field.trim()] = {[operator]: Number(value)};
                }
        });

        console.log(queryObject)
    }
    let result = product.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        console.log(sortList)
        result = result.sort(sortList)
        // console.log(result)
    }

    else {
        result = result.sort('createdAt')
    }

    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList)
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const products = await result
    res.status(200).json({ products, nHits: products.length })
}

module.exports = { getAllproducts, getAllproductsStatic }