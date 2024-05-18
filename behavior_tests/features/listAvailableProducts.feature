Feature: See available products
    Scenario: See available products
        When I request the list of products
        Then I get the list of products
