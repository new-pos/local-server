"use strict"

const sdk = require("../../libraries");

function inject_product_addon_discount(product, discount) {
  product = product.map(item => {
    item.variants = item.variants.map(variant => {
      variant.options = variant.options.map(option => {
        option.addon = option.addon.map(addon_group => {
          addon_group.list = addon_group.list.map(addon => {
            addon.sales_type = addon.sales_type.map(sales_type => {
              sales_type.price = +sales_type.price;

              discount.forEach(_discount => {
                _discount.setup.forEach(setup => {
                  if (setup.target_id == addon.id) {
                    sales_type.discount_name = _discount.name;
                    sales_type.discount = +setup.value;
                    sales_type.discount_type = +setup.count_by;

                    if (!sales_type.discount_type) {
                      sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                    } else {
                      sales_type.final_price = +sales_type.price - +sales_type.discount;
                    }
                  }
                });
              });

              if (!sales_type.final_price) {
                sales_type.final_price = +sales_type.price;
              }

              if (sales_type.final_price < 0) {
                sales_type.final_price = 0;
              }

              console.log("sales_type", discount);

              return sales_type;
            });

            return addon;
          });

          return addon_group;
        });

        return option;
      });
      
      return variant;
    });

    return item;
  });

  return product;
}

function inject_product_addon_group_discount(product, discount) {
  product = product.map(item => {
    item.variants = item.variants.map(variant => {
      variant.options = variant.options.map(option => {
        option.addon = option.addon.map(addon_group => {
          addon_group.list = addon_group.list.map(addon => {
            addon.sales_type = addon.sales_type.map(sales_type => {
              sales_type.price = +sales_type.price;

              discount.forEach(_discount => {
                _discount.setup.forEach(setup => {
                  if (setup.target_id == addon_group.id && (sales_type.discount == "" || sales_type.discount == "0")) {
                    sales_type.discount = +setup.value;
                    sales_type.discount_name = _discount.name;
                    sales_type.discount_type = +setup.count_by;

                    if (!sales_type.discount_type) {
                      sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                    } else {
                      sales_type.final_price = +sales_type.price - +sales_type.discount;
                    }
                  }
                });
              });

              if (!sales_type.final_price) {
                sales_type.final_price = +sales_type.price;
              }

              if (sales_type.final_price < 0) {
                sales_type.final_price = 0;
              }

              return sales_type;
            });

            return addon;
          });

          return addon_group;
        });

        return option;
      });
      
      return variant;
    });

    return item;
  });

  return product;
}

function inject_product_option_discount(product, discount) {
  product = product.map(item => {
    item.variants = item.variants.map(variant => {
      variant.options = variant.options.map(option => {
        option.sales_type = option.sales_type.map(sales_type => {
          sales_type.price = +sales_type.price;

          discount.forEach(_discount => {
            _discount.setup.forEach(setup => {
              if (setup.target_id == option.id && (sales_type.discount == "" || sales_type.discount == "0")) {
                sales_type.discount = +setup.value;
                sales_type.discount_name = _discount.name;
                sales_type.discount_type = +setup.count_by;

                if (!sales_type.discount_type) {
                  sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                } else {
                  sales_type.final_price = +sales_type.price - +sales_type.discount;
                }
              }
            });
          });

          if (!sales_type.final_price) {
            sales_type.final_price = +sales_type.price;
          }

          if (sales_type.final_price < 0) {
            sales_type.final_price = 0;
          }

          return sales_type;
        });

        option.addon = option.addon.map(addon_group => {
          addon_group.list = addon_group.list.map(addon => {
            addon.sales_type = addon.sales_type.map(sales_type => {
              sales_type.price = +sales_type.price;

              discount.forEach(_discount => {
                _discount.setup.forEach(setup => {
                  if (setup.target_id == option.id && (sales_type.discount == "" || sales_type.discount == "0") && setup.include_addon) {
                    sales_type.discount_name = _discount.name;
                    sales_type.discount = +setup.value;
                    sales_type.discount_type = +setup.count_by;

                    if (!sales_type.discount_type) {
                      sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                    } else {
                      sales_type.final_price = +sales_type.price - +sales_type.discount;
                    }
                  }
                });
              });

              if (!sales_type.final_price) {
                sales_type.final_price = +sales_type.price;
              }

              if (sales_type.final_price < 0) {
                sales_type.final_price = 0;
              }

              console.log("sales_type", discount);

              return sales_type;
            });

            return addon;
          });

          return addon_group;
        });

        return option;
      });
      
      return variant;
    });

    return item;
  });

  return product;
}

function inject_product_variant_discount(product, discount) {
  product = product.map(item => {
    item.variants = item.variants.map(variant => {
      variant.options = variant.options.map(option => {
        option.sales_type = option.sales_type.map(sales_type => {
          sales_type.price = +sales_type.price;

          discount.forEach(_discount => {
            _discount.setup.forEach(setup => {
              if (setup.target_id == variant.id && (sales_type.discount == "" || sales_type.discount == "0")) {
                sales_type.discount = +setup.value;
                sales_type.discount_name = _discount.name;
                sales_type.discount_type = +setup.count_by;

                if (!sales_type.discount_type) {
                  sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                } else {
                  sales_type.final_price = +sales_type.price - +sales_type.discount;
                }
              }
            });
          });

          if (!sales_type.final_price) {
            sales_type.final_price = +sales_type.price;
          }

          if (sales_type.final_price < 0) {
            sales_type.final_price = 0;
          }

          return sales_type;
        });

        option.addon = option.addon.map(addon_group => {
          addon_group.list = addon_group.list.map(addon => {
            addon.sales_type = addon.sales_type.map(sales_type => {
              sales_type.price = +sales_type.price;

              discount.forEach(_discount => {
                _discount.setup.forEach(setup => {
                  if (setup.target_id == variant.id && (sales_type.discount == "" || sales_type.discount == "0") && setup.include_addon) {
                    sales_type.discount_name = _discount.name;
                    sales_type.discount = +setup.value;
                    sales_type.discount_type = +setup.count_by;

                    if (!sales_type.discount_type) {
                      sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                    } else {
                      sales_type.final_price = +sales_type.price - +sales_type.discount;
                    }
                  }
                });
              });

              if (!sales_type.final_price) {
                sales_type.final_price = +sales_type.price;
              }

              if (sales_type.final_price < 0) {
                sales_type.final_price = 0;
              }

              console.log("sales_type", discount);

              return sales_type;
            });

            return addon;
          });

          return addon_group;
        });

        return option;
      });
      
      return variant;
    });

    return item;
  });

  return product;
}

function inject_product_discount(product, discount) {
  product = product.map(item => {
    item.variants = item.variants.map(variant => {
      variant.options = variant.options.map(option => {
        option.sales_type = option.sales_type.map(sales_type => {
          sales_type.price = +sales_type.price;

          discount.forEach(_discount => {
            _discount.setup.forEach(setup => {
              if (setup.target_id == item.product_id && (sales_type.discount == "" || sales_type.discount == "0")) {
                sales_type.discount = +setup.value;
                sales_type.discount_name = _discount.name;
                sales_type.discount_type = +setup.count_by;

                if (!sales_type.discount_type) {
                  sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                } else {
                  sales_type.final_price = +sales_type.price - +sales_type.discount;
                }
              }
            });
          });

          if (!sales_type.final_price) {
            sales_type.final_price = +sales_type.price;
          }

          if (sales_type.final_price < 0) {
            sales_type.final_price = 0;
          }

          return sales_type;
        });

        option.addon = option.addon.map(addon_group => {
          addon_group.list = addon_group.list.map(addon => {
            addon.sales_type = addon.sales_type.map(sales_type => {
              sales_type.price = +sales_type.price;

              discount.forEach(_discount => {
                _discount.setup.forEach(setup => {
                  if (setup.target_id == variant.id && (sales_type.discount == "" || sales_type.discount == "0") && setup.include_addon) {
                    sales_type.discount_name = _discount.name;
                    sales_type.discount = +setup.value;
                    sales_type.discount_type = +setup.count_by;

                    if (!sales_type.discount_type) {
                      sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                    } else {
                      sales_type.final_price = +sales_type.price - +sales_type.discount;
                    }
                  }
                });
              });

              if (!sales_type.final_price) {
                sales_type.final_price = +sales_type.price;
              }

              if (sales_type.final_price < 0) {
                sales_type.final_price = 0;
              }

              console.log("sales_type", discount);

              return sales_type;
            });

            return addon;
          });

          return addon_group;
        });

        return option;
      });
      
      return variant;
    });

    return item;
  });

  return product;
}

function inject_product_sub_category_discount(product, discount) {
  product = product.map(item => {
    item.variants = item.variants.map(variant => {
      variant.options = variant.options.map(option => {
        option.sales_type = option.sales_type.map(sales_type => {
          sales_type.price = +sales_type.price;

          discount.forEach(_discount => {
            _discount.setup.forEach(setup => {
              if (setup.target_id == item.product_sub_category_id && (sales_type.discount == "" || sales_type.discount == "0")) {
                sales_type.discount = +setup.value;
                sales_type.discount_name = _discount.name;
                sales_type.discount_type = +setup.count_by;

                if (!sales_type.discount_type) {
                  sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                } else {
                  sales_type.final_price = +sales_type.price - +sales_type.discount;
                }
              }
            });
          });

          if (!sales_type.final_price) {
            sales_type.final_price = +sales_type.price;
          }

          if (sales_type.final_price < 0) {
            sales_type.final_price = 0;
          }

          return sales_type;
        });

        option.addon = option.addon.map(addon_group => {
          addon_group.list = addon_group.list.map(addon => {
            addon.sales_type = addon.sales_type.map(sales_type => {
              sales_type.price = +sales_type.price;

              discount.forEach(_discount => {
                _discount.setup.forEach(setup => {
                  if (setup.target_id == variant.id && (sales_type.discount == "" || sales_type.discount == "0") && setup.include_addon) {
                    sales_type.discount_name = _discount.name;
                    sales_type.discount = +setup.value;
                    sales_type.discount_type = +setup.count_by;

                    if (!sales_type.discount_type) {
                      sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                    } else {
                      sales_type.final_price = +sales_type.price - +sales_type.discount;
                    }
                  }
                });
              });

              if (!sales_type.final_price) {
                sales_type.final_price = +sales_type.price;
              }

              if (sales_type.final_price < 0) {
                sales_type.final_price = 0;
              }

              console.log("sales_type", discount);

              return sales_type;
            });

            return addon;
          });

          return addon_group;
        });

        return option;
      });
      
      return variant;
    });

    return item;
  });

  return product;
}

function inject_product_category_discount(product, discount) {
  product = product.map(item => {
    item.variants = item.variants.map(variant => {
      variant.options = variant.options.map(option => {
        option.sales_type = option.sales_type.map(sales_type => {
          sales_type.price = +sales_type.price;

          discount.forEach(_discount => {
            _discount.setup.forEach(setup => {
              if (setup.target_id == item.product_category_id && (sales_type.discount == "" || sales_type.discount == "0")) {
                sales_type.discount = +setup.value;
                sales_type.discount_name = _discount.name;
                sales_type.discount_type = +setup.count_by;

                if (!sales_type.discount_type) {
                  sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                } else {
                  sales_type.final_price = +sales_type.price - +sales_type.discount;
                }
              }
            });
          });

          if (!sales_type.final_price) {
            sales_type.final_price = +sales_type.price;
          }

          if (sales_type.final_price < 0) {
            sales_type.final_price = 0;
          }

          return sales_type;
        });

        option.addon = option.addon.map(addon_group => {
          addon_group.list = addon_group.list.map(addon => {
            addon.sales_type = addon.sales_type.map(sales_type => {
              sales_type.price = +sales_type.price;

              discount.forEach(_discount => {
                _discount.setup.forEach(setup => {
                  if (setup.target_id == variant.id && (sales_type.discount == "" || sales_type.discount == "0") && setup.include_addon) {
                    sales_type.discount_name = _discount.name;
                    sales_type.discount = +setup.value;
                    sales_type.discount_type = +setup.count_by;

                    if (!sales_type.discount_type) {
                      sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                    } else {
                      sales_type.final_price = +sales_type.price - +sales_type.discount;
                    }
                  }
                });
              });

              if (!sales_type.final_price) {
                sales_type.final_price = +sales_type.price;
              }

              if (sales_type.final_price < 0) {
                sales_type.final_price = 0;
              }

              console.log("sales_type", discount);

              return sales_type;
            });

            return addon;
          });

          return addon_group;
        });

        return option;
      });
      
      return variant;
    });

    return item;
  });

  return product;
}

function inject_product_group_discount(product, discount) {
  product = product.map(item => {
    item.variants = item.variants.map(variant => {
      variant.options = variant.options.map(option => {
        option.sales_type = option.sales_type.map(sales_type => {
          sales_type.price = +sales_type.price;

          discount.forEach(_discount => {
            _discount.setup.forEach(setup => {
              if (setup.target_id == item.product_group_id && (sales_type.discount == "" || sales_type.discount == "0")) {
                sales_type.discount = +setup.value;
                sales_type.discount_name = _discount.name;
                sales_type.discount_type = +setup.count_by;

                if (!sales_type.discount_type) {
                  sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                } else {
                  sales_type.final_price = +sales_type.price - +sales_type.discount;
                }
              }
            });
          });

          if (!sales_type.final_price) {
            sales_type.final_price = +sales_type.price;
          }

          if (sales_type.final_price < 0) {
            sales_type.final_price = 0;
          }

          return sales_type;
        });

        return option;
      });

      option.addon = option.addon.map(addon_group => {
        addon_group.list = addon_group.list.map(addon => {
          addon.sales_type = addon.sales_type.map(sales_type => {
            sales_type.price = +sales_type.price;

            discount.forEach(_discount => {
              _discount.setup.forEach(setup => {
                if (setup.target_id == variant.id && (sales_type.discount == "" || sales_type.discount == "0") && setup.include_addon) {
                  sales_type.discount_name = _discount.name;
                  sales_type.discount = +setup.value;
                  sales_type.discount_type = +setup.count_by;

                  if (!sales_type.discount_type) {
                    sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                  } else {
                    sales_type.final_price = +sales_type.price - +sales_type.discount;
                  }
                }
              });
            });

            if (!sales_type.final_price) {
              sales_type.final_price = +sales_type.price;
            }

            if (sales_type.final_price < 0) {
              sales_type.final_price = 0;
            }

            console.log("sales_type", discount);

            return sales_type;
          });

          return addon;
        });

        return addon_group;
      });
      
      return variant;
    });

    return item;
  });

  return product;
}

function inject_product_brand_discount(product, discount) {
  product = product.map(item => {
    item.variants = item.variants.map(variant => {
      variant.options = variant.options.map(option => {
        option.sales_type = option.sales_type.map(sales_type => {
          sales_type.price = +sales_type.price;

          discount.forEach(_discount => {
            _discount.setup.forEach(setup => {
              if (setup.target_id == item.brand_id && (sales_type.discount == "" || sales_type.discount == "0")) {
                sales_type.discount = +setup.value;
                sales_type.discount_name = _discount.name;
                sales_type.discount_type = +setup.count_by;

                if (!sales_type.discount_type) {
                  sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                } else {
                  sales_type.final_price = +sales_type.price - +sales_type.discount;
                }
              }
            });
          });

          if (!sales_type.final_price) {
            sales_type.final_price = +sales_type.price;
          }

          if (sales_type.final_price < 0) {
            sales_type.final_price = 0;
          }

          return sales_type;
        });
        
        option.addon = option.addon.map(addon_group => {
          addon_group.list = addon_group.list.map(addon => {
              addon.sales_type = addon.sales_type.map(sales_type => {
                sales_type.price = +sales_type.price;

                discount.forEach(_discount => {
                  _discount.setup.forEach(setup => {
                    if (setup.target_id == variant.id && (sales_type.discount == "" || sales_type.discount == "0") && setup.include_addon) {
                      sales_type.discount_name = _discount.name;
                      sales_type.discount = +setup.value;
                      sales_type.discount_type = +setup.count_by;

                      if (!sales_type.discount_type) {
                        sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                      } else {
                        sales_type.final_price = +sales_type.price - +sales_type.discount;
                      }
                    }
                  });
                });

                if (!sales_type.final_price) {
                  sales_type.final_price = +sales_type.price;
                }

                if (sales_type.final_price < 0) {
                  sales_type.final_price = 0;
                }

                console.log("sales_type", discount);

                return sales_type;
              });

            return addon;
          });

          return addon_group;
        });

        return option;
      });
      
      return variant;
    });

    return item;
  });

  return product;
}

function inject_sales_type_discount(product, discount) {
  product = product.map(item => {
    item.variants = item.variants.map(variant => {
      variant.options = variant.options.map(option => {
        option.sales_type = option.sales_type.map(sales_type => {
          sales_type.price = +sales_type.price;

          discount.forEach(_discount => {
            _discount.setup.forEach(setup => {
              if (setup.target_id == sales_type.id && (sales_type.discount == "" || sales_type.discount == "0")) {
                sales_type.discount = +setup.value;
                sales_type.discount_name = _discount.name;
                sales_type.discount_type = +setup.count_by;

                if (!sales_type.discount_type) {
                  sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                } else {
                  sales_type.final_price = +sales_type.price - +sales_type.discount;
                }
              }
            });
          });

          if (!sales_type.final_price) {
            sales_type.final_price = +sales_type.price;
          }

          if (sales_type.final_price < 0) {
            sales_type.final_price = 0;
          }

          return sales_type;
        });

        option.addon = option.addon.map(addon_group => {
          addon_group.list = addon_group.list.map(addon => {
            addon.sales_type = addon.sales_type.map(sales_type => {
              sales_type.price = +sales_type.price;

              discount.forEach(_discount => {
                _discount.setup.forEach(setup => {
                  if (setup.target_id == variant.id && (sales_type.discount == "" || sales_type.discount == "0") && setup.include_addon) {
                    sales_type.discount_name = _discount.name;
                    sales_type.discount = +setup.value;
                    sales_type.discount_type = +setup.count_by;

                    if (!sales_type.discount_type) {
                      sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                    } else {
                      sales_type.final_price = +sales_type.price - +sales_type.discount;
                    }
                  }
                });
              });

              if (!sales_type.final_price) {
                sales_type.final_price = +sales_type.price;
              }

              if (sales_type.final_price < 0) {
                sales_type.final_price = 0;
              }

              console.log("sales_type", discount);

              return sales_type;
            });

            return addon;
          });

          return addon_group;
        });

        return option;
      });
      
      return variant;
    });

    return item;
  });

  return product;
}

function inject_all_discount(product, discount) {
  product = product.map(item => {
    item.variants = item.variants.map(variant => {
      variant.options = variant.options.map(option => {
        option.sales_type = option.sales_type.map(sales_type => {
          sales_type.price = +sales_type.price;

          discount.forEach(_discount => {
            _discount.setup.forEach(setup => {
              if (sales_type.discount == "" || sales_type.discount == "0") {
                sales_type.discount = +setup.value;
                sales_type.discount_name = _discount.name;
                sales_type.discount_type = +setup.count_by;

                if (!sales_type.discount_type) {
                  sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                } else {
                  sales_type.final_price = +sales_type.price - +sales_type.discount;
                }
              }
            });
          });

          if (!sales_type.final_price) {
            sales_type.final_price = +sales_type.price;
          }

          if (sales_type.final_price < 0) {
            sales_type.final_price = 0;
          }

          return sales_type;
        });

        option.addon = option.addon.map(addon_group => {
          addon_group.list = addon_group.list.map(addon => {
            addon.sales_type = addon.sales_type.map(sales_type => {
              sales_type.price = +sales_type.price;

              discount.forEach(_discount => {
                _discount.setup.forEach(setup => {
                  if (setup.target_id == variant.id && (sales_type.discount == "" || sales_type.discount == "0") && setup.include_addon) {
                    sales_type.discount_name = _discount.name;
                    sales_type.discount = +setup.value;
                    sales_type.discount_type = +setup.count_by;

                    if (!sales_type.discount_type) {
                      sales_type.final_price = +sales_type.price - (+sales_type.price * +sales_type.discount / 100);
                    } else {
                      sales_type.final_price = +sales_type.price - +sales_type.discount;
                    }
                  }
                });
              });

              if (!sales_type.final_price) {
                sales_type.final_price = +sales_type.price;
              }

              if (sales_type.final_price < 0) {
                sales_type.final_price = 0;
              }

              console.log("sales_type", discount);

              return sales_type;
            });

            return addon;
          });

          return addon_group;
        });

        return option;
      });
      
      return variant;
    });

    return item;
  });

  return product;
}
  
async function list_product(request, response) {
  try {
    let product = await sdk.db.product.find({ }, {});
    let discount = await sdk.db.discount.find({ }, {});

    product  = product.map(doc => doc.toObject());
    discount = discount.map(doc => doc.toObject());

    const target_product_addon = discount.filter(item => item.target === "product_addon");
    const target_product_addon_group = discount.filter(item => item.target === "product_addon_group");
    const target_product_tag = discount.filter(item => item.target === "product_tag");
    const target_product_option = discount.filter(item => item.target === "product_option");
    const target_product_variant = discount.filter(item => item.target === "product_variant");
    const target_product = discount.filter(item => item.target === "product");
    const target_product_sub_category = discount.filter(item => item.target === "product_sub_category");
    const target_product_category = discount.filter(item => item.target === "product_category");
    const target_product_group = discount.filter(item => item.target === "product_group");
    const target_product_brand = discount.filter(item => item.target === "product_brand");
    const target_sales_type = discount.filter(item => item.target === "sales_type");
    const target_all = discount.filter(item => item.target === "all");

    console.log("target_product_addon", target_product_addon);
    console.log("target_product_addon_group", target_product_addon_group);
    console.log("target_product_tag", target_product_tag);
    console.log("target_product_option", target_product_option);
    console.log("target_product_variant", target_product_variant);
    console.log("target_product", target_product);
    console.log("target_product_sub_category", target_product_sub_category);
    console.log("target_product_category", target_product_category);
    console.log("target_product_group", target_product_group);
    console.log("target_product_brand", target_product_brand);
    console.log("target_sales_type", target_sales_type);
    console.log("target_all", target_all);

    if (target_product_addon.length > 0) {
      product = inject_product_addon_discount(product, target_product_addon);
    }

    if (target_product_addon_group.length > 0) {
      product = inject_product_addon_group_discount(product, target_product_addon_group);
    }

    if (target_product_option.length > 0) {
      product = inject_product_option_discount(product, target_product_option);
    }

    if (target_product_variant.length > 0) {
      product = inject_product_variant_discount(product, target_product_variant);
    }

    if (target_product.length > 0) {
      product = inject_product_discount(product, target_product);
    }

    if (target_product_sub_category.length > 0) {
      product = inject_product_sub_category_discount(product, target_product_sub_category);
    }

    if (target_product_category.length > 0) {
      product = inject_product_category_discount(product, target_product_category);
    }

    if (target_product_group.length > 0) {
      product = inject_product_group_discount(product, target_product_group);
    }

    if (target_product_brand.length > 0) {
      product = inject_product_brand_discount(product, target_product_brand);
    }

    console.log("target_product_tag", target_product_tag);

    if (target_sales_type.length > 0) {
      product = inject_sales_type_discount(product, target_sales_type);
    }

    if (target_all.length > 0) {
      product = inject_all_discount(product, target_all);
    }

    product = product.map(item => {
      item.variants = item.variants.map(variant => {
        variant.options = variant.options.map(option => {
          option.sales_type = option.sales_type.map(sales_type => {
            if (!sales_type.final_price) {
              sales_type.final_price = sales_type.price;
            }

            return sales_type;
          });

          option.addon = option.addon.map(addon_group => {
            addon_group.list = addon_group.list.map(addon => {
              addon.sales_type = addon.sales_type.map(sales_type => {
                if (!sales_type.final_price) {
                  sales_type.final_price = sales_type.price;
                }

                return sales_type;
              });

              return addon;
            });

            return addon_group;
          });

          return option;
        });

        return variant;
      });

      return item;
    });

    return response.status(200).json({
      message: "Success get_product",
      result : product,
    });
  } catch (error) {
    console.log("Error get_product", error);

    return response.status(500).json({
      message: "Error get_product",
      error: error,
    });
  }
}

async function outlet_info(request, response) {
  try {
    let [outlet] = await sdk.db.outlet.find();

    outlet = outlet.toObject();

    let stations = await sdk.db.station.find();

    stations = stations.map(doc => doc.toObject());

    outlet.stations = stations;

    return response.json({
      status: outlet ? true : false,
      data: outlet || null,
    });
  } catch (error) {
    console.log("[outlet_info].error", error);

    return response.json({
      status: false,
      message: error.message,
    });
  }
}

async function table(request, response) {
  try {
    const table = await sdk.db.table.find();

    return response.json({
      status: true,
      data  : table,
    });
  } catch (error) {
    console.log("[table].error", error);

    return response.json({
      status: false,
      message: error.message,
    });
  }
}

async function product_group(request, response) {
  try {
    const product_group = await sdk.db.product_group.find();

    return response.json({
      status: true,
      data  : product_group || [],
    });
  } catch (error) {
    console.log("[product_group].error", error);

    return response.json({
      status  : false,
      message : error.message,
    });
  }
}

async function product_category(request, response) {
  try {
    const product_category = await sdk.db.product_category.find();

    return response.json({
      status: true,
      data  : product_category || [],
    });
  } catch (error) {
    console.log("[product_category].error", error);

    return response.json({
      status  : false,
      message : error.message,
    });
  }
}

async function product_sub_category(request, response) {
  try {
    const product_sub_category = await sdk.db.product_sub_category.find();

    return response.json({
      status: true,
      data  : product_sub_category || [],
    });
  } catch (error) {
    console.log("[product_sub_category].error", error);

    return response.json({
      status  : false,
      message : error.message,
    });
  }
}

// async function list_product(request, response) {
//   try {
//     const list_product = await sdk.db.product.find();

//     return response.json({
//       status: true,
//       data  : list_product || [],
//     });
//   } catch (error) {
//     console.log("[list_product].error", error);

//     return response.json({
//       status  : false,
//       message : error.message,
//     });
//   }
// }

async function sales_type(request, response) {
  try {
    const sales_type = await sdk.db.sales_type.findOne({ dine_in: 1 }, {});

    return response.json({
      status: true,
      data  : sales_type || null,
    });
  } catch (error) {
    console.log("[sales_type].error", error);
  }
}

module.exports = {
  outlet_info,
  table,
  product_group,
  product_category,
  product_sub_category,
  list_product,
  sales_type,
};
