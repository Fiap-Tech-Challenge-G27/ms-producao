Feature: Order Normal Flow
    Scenario: Pay
        Given My order was received
        When I pay my order
        Then My order is in preparation
        Then My order's payment state is approved

    # Scenario:
    #     Given My order is in preparation
    #     When I wait the my order preparation
    #     Then My order is Done
    
    # Scenario:
    #     Given My order was done
    #     When I get my order
    #     Then My order was finished