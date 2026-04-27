def test_product_repository_create(product_repo):
    """Test creating a product."""
    product_data = {
        'title': 'Test Llanta 205/55R16',
        'brand': 'Michelin',
        'size': '205/55R16',
        'price': 2500.0,
        'source': 'test',
        'url': 'http://test.com'
    }
    product = product_repo.create_product(product_data)
    assert product is not None
    assert product.id > 0
    assert product.title == product_data['title']
    assert product.price == product_data['price']

def test_product_repository_get_by_id(product_repo):
    """Test getting product by ID."""
    # Create a product first
    product = product_repo.create_product({
        'title': 'Test Product 2',
        'brand': 'Goodyear',
        'size': '215/60R16',
        'price': 1800.0,
        'source': 'test'
    })
    assert product is not None
    
    # Retrieve it
    retrieved = product_repo.get_by_id(product.id)
    assert retrieved is not None
    assert retrieved.id == product.id
    assert retrieved.brand == 'Goodyear'

def test_product_repository_get_by_brand(product_repo):
    """Test getting products by brand."""
    # Create multiple products
    product_repo.create_product({
        'title': 'Michelin 1',
        'brand': 'Michelin',
        'size': '205/55R16',
        'price': 2000.0,
        'source': 'test'
    })
    product_repo.create_product({
        'title': 'Michelin 2',
        'brand': 'Michelin',
        'size': '215/60R16',
        'price': 2200.0,
        'source': 'test'
    })
    product_repo.create_product({
        'title': 'Goodyear 1',
        'brand': 'Goodyear',
        'size': '205/55R16',
        'price': 1800.0,
        'source': 'test'
    })
    
    # Query by brand
    michelins = product_repo.get_by_brand('Michelin', limit=10)
    assert len(michelins) >= 2
    for p in michelins:
        assert p.brand == 'Michelin'

def test_product_count(product_repo):
    """Test counting products."""
    initial_count = product_repo.count()
    product_repo.create_product({
        'title': 'Count Test',
        'brand': 'Test',
        'size': '205/55R16',
        'price': 1000.0,
        'source': 'test'
    })
    assert product_repo.count() == initial_count + 1