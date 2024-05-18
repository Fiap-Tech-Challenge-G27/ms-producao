Feature: Order Normal Flow
    Scenario: Make Order
        When I order 1 bigMac 1 cake
        # Then My order is received
        # Then My order's payment state is pending
        # Then I receive the list of ordered products

    # Scenario: Pay
    #     Given: My order is pending
    #     When: I pay my order
    #     Then: My order is in preparation
    #     Then: My order's payment state is approved

    # Scenario:
    #     Given: My order is in preparation
    #     When: I wait the my order preparation
    #     Then: My order is Done
    
    # Scenario:
    #     Given: My order is done
    #     When: I get my order
    #     Then: My order is finished